import { AndroidConfig, ConfigPlugin, withAndroidManifest } from 'expo/config-plugins'

const resetPermissions = (androidManifest: AndroidConfig.Manifest.AndroidManifest) => {
  AndroidConfig.Permissions.removePermissions(androidManifest, [
    'android.permission.BLUETOOTH_SCAN',
  ])

  if (!Array.isArray(androidManifest.manifest['uses-permission'])) {
    androidManifest.manifest['uses-permission'] = []
  }
  if (!Array.isArray(androidManifest.manifest['uses-feature'])) {
    androidManifest.manifest['uses-feature'] = []
  }
  return androidManifest
}

const updatePermissions = (androidManifest: AndroidConfig.Manifest.AndroidManifest) => {
  androidManifest.manifest['uses-permission']?.push(
    {
      $: {
        'android:name': 'android.permission.BLUETOOTH_SCAN',
        // @ts-ignore: type definition is incorrect
        'android:usesPermissionFlags': 'neverForLocation',
      },
    }
  )
  androidManifest.manifest['uses-feature']?.push({
    $: {
      'android:name': 'android.hardware.bluetooth_le',
      'android:required': 'true',
    },
  })
  return androidManifest
}

const withBLE: ConfigPlugin = (config) => {
  return withAndroidManifest(config, (android) => {
    android.modResults = resetPermissions(android.modResults)
    android.modResults = updatePermissions(android.modResults)
    return android
  })
}

export default withBLE