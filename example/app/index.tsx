
import React from 'react'
import {
  View,
  Platform,
  NativeModules,
  NativeEventEmitter,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native'

const BleManagerModule = NativeModules.BleManager
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule)

export default function DFUScreen() {
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
