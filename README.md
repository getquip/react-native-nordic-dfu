# React Native Nordic DFU

> ⚠️ Warning! This library is a fork from a discontinued library. The original project was at [Pilloxa/react-native-nordic-dfu](https://github.com/Pilloxa/react-native-nordic-dfu). Our fork is built off a more up-to-date fork from [DomiR/react-native-nordic-dfu](https://github.com/DomiR/react-native-nordic-dfu) that works with Android 14. The quip fork should also now work with iOS 17.

This library allows you to perform a Device Firmware Update (DFU) of your nrf51 or nrf52 chip from Nordic Semiconductor. It is tested on both iOS (17) and Android (14).

For more info about the DFU process, see: [Resources](#resources).

Please keep in mind the our availability to maintain this fork is limited and is based on our project needs.

## Installation

Install and link the NPM package per usual with

```bash
npm install --save https://github.com/getquip/react-native-nordic-dfu
```

or

```bash
yarn add https://github.com/getquip/react-native-nordic-dfu
```

## Setup

### iOS

The iOS project is written in Objective-C. You'll need to add the following to `Podfile` and `AppDelegate.mm`. Please see the [iOS example project](example/ios).

`Podfile`:

```ruby
static_frameworks = ['iOSDFULibrary']
pre_install do |installer|
  installer.pod_targets.each do |pod|
    if static_frameworks.include?(pod.name)
      puts "Overriding the static_frameworks? method for #{pod.name}"
      def pod.build_type;
        Pod::BuildType.new(:linkage => :static, :packaging => :framework)
      end
    end
  end
end

target "YourApp" do
  # ...
  pod "react-native-nordic-dfu", path: "../node_modules/@getquip/react-native-nordic-dfu"
  # ...
end
```

`AppDelegate.mm`:

```objective-c
// ...
#import "RNNordicDfu.h"
// ...

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // ...
  [RNNordicDfu setCentralManagerGetter:^() {
          return [[CBCentralManager alloc] initWithDelegate:nil queue:dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0)];
      }];

        // Reset manager delegate since the Nordic DFU lib "steals" control over it
            [RNNordicDfu setOnDFUComplete:^() {
                NSLog(@"onDFUComplete");
            }];
            [RNNordicDfu setOnDFUError:^() {
                NSLog(@"onDFUError");
            }];
  // ...
}
```

### Android

Android does not require any special setup. Please see the [Android example project](example/android).

## Example Project

This example assumes you already have the basics installed to run cocapods, gradle, java, etc. Note that you must setup the xcode project with the correct Signing & Capabilities.

1. `cd example`
2. `yarn setup`
3. Go to `example/App.tsx`
4. Update the `filePath` variable with the link to the firmware file
5. Update the `BleManagerService.init('', '');` function with the DFU Service & the device name
6. Press `Connect to Device in Area` button
7. When you see some small info about the device on the screen Press the `Start Update`
8. If you have any problems connecting to the Device pleas consult the [react-native-ble-manager](https://github.com/innoveit/react-native-ble-manager)

## Resources

- [Legacy DFU Introduction](http://infocenter.nordicsemi.com/topic/com.nordic.infocenter.sdk5.v11.0.0/examples_ble_dfu.html?cp=6_0_0_4_3_1 "BLE Bootloader/DFU")
- [Secure DFU Introduction](https://infocenter.nordicsemi.com/topic/sdk_nrf5_v17.1.0/lib_bootloader_modules.html?cp=8_1_3_5 "BLE Secure DFU Bootloader")
- [nRF51 Development Kit (DK)](https://www.nordicsemi.com/Software-and-tools/Development-Kits/nRF51-DK "nRF51 DK") (compatible with Arduino Uno Revision 3)
- [nRF52 Development Kit (DK)](https://www.nordicsemi.com/Software-and-tools/Development-Kits/nRF52-DK "nRF52 DK") (compatible with Arduino Uno Revision 3)
- [nRF52840 Development Kit (DK)](https://www.nordicsemi.com/Software-and-tools/Development-Kits/nRF52840-DK "nRF52840 DK") (compatible with Arduino Uno Revision 3)
