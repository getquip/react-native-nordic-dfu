import { DFUEmitter, NordicDFU } from '@getquip/react-native-nordic-dfu'
import { Asset } from 'expo-asset'
import * as Linking from 'expo-linking'
import React, { useEffect, useState } from 'react'
import {
  View,
  Platform,
  NativeModules,
  NativeEventEmitter,
  KeyboardAvoidingView,
  ScrollView,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native'
import BleManager, { Peripheral } from 'react-native-ble-manager'
import { Text, TextInput, Button } from 'react-native-paper'

const BleManagerModule = NativeModules.BleManager
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)

const requestAndroidPermissions = async () => {
  const result = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
  ])

  if (
    result['android.permission.BLUETOOTH_ADVERTISE'] === 'never_ask_again' ||
    result['android.permission.BLUETOOTH_CONNECT'] === 'never_ask_again' ||
    result['android.permission.BLUETOOTH_SCAN'] === 'never_ask_again'
  ) {
    console.error('User refuses Android permissions (never_ask_again)')
    return false
  }

  if (
    result['android.permission.BLUETOOTH_ADVERTISE'] === 'denied' ||
    result['android.permission.BLUETOOTH_CONNECT'] === 'denied' ||
    result['android.permission.BLUETOOTH_SCAN'] === 'denied'
  ) {
    console.warn('User refuses Android permissions (denied)')
    return false
  }

  if (
    result['android.permission.BLUETOOTH_ADVERTISE'] === 'granted' &&
    result['android.permission.BLUETOOTH_CONNECT'] === 'granted' &&
    result['android.permission.BLUETOOTH_SCAN'] === 'granted'
  ) {
    console.debug('User accepts Android permissions android (granted)')
    return true
  }

  console.error('PermissionsAndroid.requestMultiple return unknown response', result)
  return false
}

interface FirmwareProgress {
  state: string
  percent: number
  isError: boolean
  isComplete: boolean
}

export default function DFUScreen() {
  const [peripherals, setPeripherals] = useState<Peripheral[]>([])
  const [selectedPeripheral, setSelectedPeripheral] = useState<Peripheral>()
  const [firmwareUrl, setFirmwareUrl] = useState<string | false>()
  const [firmwareProgress, setFirmwareProgress] = useState<FirmwareProgress | undefined>(undefined)

  const handleScan = async () => {
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', async (peripheral: Peripheral) => {
      console.log('Discovered peripheral:', peripheral)
      setPeripherals((peripherals) => {
        return !peripherals.find((p) => p.id === peripheral.id) ? [...peripherals, peripheral] : peripherals
      })
    })
    try {
      await handleReset()
      console.log('SERVICE_UUID:', process.env.EXPO_PUBLIC_BLE_SERVICE_UUID)
      await BleManager.scan([process.env.EXPO_PUBLIC_BLE_SERVICE_UUID!], 10, false)
    } catch (error) {
      await BleManager.stopScan()
      throw error
    }
  }

  const handleConnect = async (peripheral: Peripheral) => {
    try {
      await BleManager.connect(peripheral.id)
      const services = await BleManager.retrieveServices(peripheral.id)
      console.debug('Services:', services)
      if (process.env.EXPO_PUBLIC_READ_CHARACTERISTIC_UUID) {
        console.log('READ_CHARACTERISTIC_UUID:', process.env.EXPO_PUBLIC_READ_CHARACTERISTIC_UUID)
        await BleManager.startNotification(
          peripheral.id,
          process.env.EXPO_PUBLIC_BLE_SERVICE_UUID!,
          process.env.EXPO_PUBLIC_READ_CHARACTERISTIC_UUID
        )
      }
      setSelectedPeripheral(peripheral)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const handleReset = async () => {
    if (selectedPeripheral) {
      await BleManager.disconnect(selectedPeripheral.id)
    }
    setPeripherals([])
    setSelectedPeripheral(undefined)
    setFirmwareUrl(undefined)
    setFirmwareProgress(undefined)
  }

  const backgroundColor = (selected: Peripheral) => {
    return selected.id === selectedPeripheral?.id ? '#b0b0b0' : '#ffffff'
  }

  const handleFirmareUrlChange = async (url: string) => {
    try {
      if (RegExp(/^https?:\/\/.*\.zip$/).test(url) === false) throw new Error('Invalid URL')
      await Linking.canOpenURL(url)
      setFirmwareUrl(url)
    } catch (error) {
      console.error(error)
      setFirmwareUrl(false)
    }
  }

  const handleUpdateFirmware = async (peripheral: Peripheral, firmwareUrl: string) => {
    // NordicDFU.startDFU takes a while to start, so we need to hide the button
    updateProgress({ state: 'CONNECTING' })
    const [{ localUri }] = await Asset.loadAsync(firmwareUrl).catch((error) => {
      console.error(error)
      updateProgress({ state: 'DFU_FAILED', percent: undefined })
      return []
    })
    console.info('Firmware URI:', firmwareUrl, localUri)

    DFUEmitter.addListener('DFUProgress', (progress) => {
      console.info('DFUProgress:', progress)
      const { percent } = progress
      if (percent % 5 === 0) {
        updateProgress({ state: 'DFU_STATE_UPLOADING', percent })
      }
    })
    DFUEmitter.addListener('DFUStateChanged', ({ state }) => {
      console.info('DFUStateChanged:', state)
      updateProgress({ state })
    })
    await NordicDFU.startDFU({
      deviceAddress: peripheral.id,
      deviceName: peripheral.name,
      filePath: localUri,
    })
      .catch((error) => {
        console.error(error)
        updateProgress({ state: 'DFU_FAILED', percent: undefined })
      })
      .finally(() => {
        DFUEmitter.removeAllListeners('DFUProgress')
        DFUEmitter.removeAllListeners('DFUStateChanged')
      })
  }

  const updateProgress = ({ percent, state }: { percent?: number | undefined; state: string | undefined }) => {
    if (state && state !== 'DFU_STATE_UPLOADING')
      switch (state) {
        case 'UNKNOWN_STATE':
        case 'DFU_ABORTED':
        case 'DFU_FAILED':
          setFirmwareProgress({ state, percent: 0, isError: true, isComplete: false })
          break
        case 'DEVICE_DISCONNECTING':
          setFirmwareProgress({ state, percent: 100, isError: false, isComplete: false })
          break
        case 'DFU_COMPLETED':
          setFirmwareProgress({ state, percent: 100, isError: false, isComplete: true })
          break
        default:
          setFirmwareProgress({ state, percent: 0, isError: false, isComplete: false })
      }
    else {
      setFirmwareProgress({ state: 'Loading...', percent: percent ?? 0, isError: false, isComplete: false })
    }
  }

  useEffect(() => {
    if (Platform.OS === 'android') {
      try {
        void requestAndroidPermissions()
      } catch (error) {
        console.error('User refuses Android BLE permissions', error)
      }
    }
  }, [])

  return (
    <KeyboardAvoidingView style={{ height: '100%' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ minHeight: '100%' }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            gap: 20,
            padding: 20,
            marginBottom: 200,
          }}
        >
          <Text variant="headlineLarge">React Native Nordic DFU</Text>
          <Button mode="contained" onPress={handleScan}>
            Scan for Devices
          </Button>
          {peripherals.length > 0 && <Text>Click one of the following devices to connect and pair:</Text>}
          {[...peripherals].map((peripheral) => (
            <TouchableOpacity
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 2,
                padding: 10,
                backgroundColor: backgroundColor(peripheral),
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#000',
              }}
              key={peripheral.id}
              onPress={async () => await handleConnect(peripheral)}
            >
              <Text>ID: {peripheral.id}</Text>
              <Text>Name: {peripheral.name}</Text>
              <Text>RSSI: {peripheral.rssi}</Text>
            </TouchableOpacity>
          ))}
          {firmwareUrl === false && <Text style={{ color: '#ff3333' }}>ERROR: Invalid URL</Text>}
          {selectedPeripheral && (
            <>
              <Text variant="titleLarge">DFU...</Text>
              <TextInput
                mode="outlined"
                label="Enter Firmware URL"
                onChangeText={async (text) => await handleFirmareUrlChange(text)}
                placeholder="https://example.com/firmware.zip"
              />
            </>
          )}
          {selectedPeripheral && firmwareUrl && (
            <Button
              style={{ marginTop: 10 }}
              mode="contained"
              disabled={typeof firmwareProgress !== 'undefined'}
              onPress={async () => {
                await handleUpdateFirmware(selectedPeripheral, firmwareUrl)
              }}
            >
              Update Firmware
            </Button>
          )}
          {firmwareProgress && <Text>{JSON.stringify(firmwareProgress, null, 2)}</Text>}
          {selectedPeripheral && (
            <>
              <Text variant="titleLarge">General...</Text>
              <Button mode="contained" onPress={handleReset}>
                Disconnect (Don't press this during DFU)
              </Button>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
