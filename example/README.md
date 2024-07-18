# Expo Example Project

This example runs on [Expo](https://expo.dev/). You can't use Expo Go, iOS simulators or Android simulators because this project uses Bluetooth. Use a physical device with developer mode enabled!

1. `cd example`
1. Create an `.env` file. Refer to `.env.example` for an example.
1. `nvm install`
1. `yarn install`
1. `yarn expo:prebuild`
1. `yarn dev:ios` or `yarn dev:android` will start Expo. Please review the [expo-cli](https://docs.expo.dev/more/expo-cli/) docs for more commands.

Expo may take a while to start if it's the first time. Have patience. Once the project is running...

1. Press `Scan for Devices` button
1. Select a Bluetooth device by pressing it
1. Fill in the DFU Firmware URL link
1. Press `Update Firmware` to run DFU

If you have any problems connecting to the Device pleas consult the [react-native-ble-manager](https://github.com/innoveit/react-native-ble-manager)
