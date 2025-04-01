// Import your global CSS file
import '../global.css'

import React from 'react'
import BleManager from 'react-native-ble-manager'
import { PaperProvider } from 'react-native-paper'

import DFUScreen from '@/app/index'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

// Only runs once per app load
// https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application
if (typeof window !== 'undefined') {
  try {
    void BleManager.start({ showAlert: false }).then(() => console.debug('BleManager started'))
  } catch (error) {
    console.error('unexpected error starting BleManager', error)
  }
}

export default function RootLayout() {
  return (
    <PaperProvider>
      <DFUScreen />
    </PaperProvider>
  )
}
