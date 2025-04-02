// @ts-nocheck
const pkg = require('./package.json');

// This is the Expo config plugin
module.exports = (config) => {
  return withNordicDFU(config);
};

// Main plugin function
const withNordicDFU = (config) => {
  // Ensure the iOS section exists
  if (!config.ios) {
    config.ios = {};
  }

  // Ensure the Android section exists
  if (!config.android) {
    config.android = {};
  }

  // Add permissions to iOS
  if (!config.ios.infoPlist) {
    config.ios.infoPlist = {};
  }

  config.ios.infoPlist.NSBluetoothAlwaysUsageDescription =
    config.ios.infoPlist.NSBluetoothAlwaysUsageDescription ||
    "Allow $(PRODUCT_NAME) to use Bluetooth for DFU updates";

  config.ios.infoPlist.NSBluetoothPeripheralUsageDescription =
    config.ios.infoPlist.NSBluetoothPeripheralUsageDescription ||
    "Allow $(PRODUCT_NAME) to use Bluetooth for DFU updates";

  // Add Android permissions
  if (!config.android.permissions) {
    config.android.permissions = [];
  }

  const bluetoothPermissions = [
    "android.permission.BLUETOOTH",
    "android.permission.BLUETOOTH_ADMIN",
    "android.permission.BLUETOOTH_SCAN",
    "android.permission.BLUETOOTH_CONNECT",
  ];

  // Only add permissions that aren't already in the array
  bluetoothPermissions.forEach(permission => {
    if (!config.android.permissions.includes(permission)) {
      config.android.permissions.push(permission);
    }
  });

  return config;
};
