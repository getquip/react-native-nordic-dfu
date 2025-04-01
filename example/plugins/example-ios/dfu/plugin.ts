import { AppDelegateProjectFile } from '@expo/config-plugins/build/ios/Paths'
import { mergeContents } from '@expo/config-plugins/build/utils/generateCode'
import { ConfigPlugin, withAppDelegate, withDangerousMod } from 'expo/config-plugins'
import * as fs from 'fs'
import * as path from 'path'

// whitespace is important!
const DFU_STATIC_FRAMEWORK = `
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
`

// whitespace is important!
const DFU_POD = `
  pod "react-native-nordic-dfu", path: "../node_modules/@getquip/react-native-nordic-dfu"
`

// whitespace is important!
const DFU_APP_DELEGATE_IMPORT = `
// !!! Nordic DFU Expo Code Injection !!!
#import "RNNordicDfu.h"
// !!! Nordic DFU Expo Code Injection !!!
`

// whitespace is important!
const DFU_APP_DELEGATE_GETTER = `
  // !!! Nordic DFU Expo Code Injection !!!
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
  // !!! Nordic DFU Expo Code Injection !!!
`

const processMerge = ({
  src,
  newSrc,
  tag,
  anchor,
  offset,
  comment,
}: {
  src: string
  newSrc: string
  tag: string
  anchor: RegExp
  offset: number
  comment: string
}) => {
  const mergeResult = mergeContents({ src, newSrc, tag, anchor, offset, comment })
  if (!mergeResult.didMerge) {
    throw new Error('Failed modify file for DFU!')
  }
  return mergeResult
}

const updateAppDelegate = (appDelegate: AppDelegateProjectFile) => {
  if (appDelegate.language === 'objcpp') {
    if (!appDelegate.contents.includes(DFU_APP_DELEGATE_IMPORT)) {
      appDelegate.contents = appDelegate.contents.replace(
        /(#import\s"AppDelegate\.h")(.*\s+)(#import <React\/RCTBundleURLProvider\.h>)/,
        `$1${DFU_APP_DELEGATE_IMPORT}\n$3`
      )
    }
    if (!appDelegate.contents.includes(DFU_APP_DELEGATE_GETTER)) {
      appDelegate.contents = appDelegate.contents.replace(
        /(didFinishLaunchingWithOptions:\(NSDictionary\s\*\)launchOptions\s{\s)(.*)(self\.moduleName = @"main";.*)/,
        `$1${DFU_APP_DELEGATE_GETTER}\n  $3`
      )
    }
  } else {
    console.warn('AppDelegate is not Obj-C. Unable to automatically configure DFU.')
  }
  return appDelegate
}

const updatePodfile = async (platformProjectRoot: string, dangerousMod: unknown) => {
  const file = path.join(platformProjectRoot, 'Podfile')
  const contents = await fs.promises.readFile(file, 'utf8')
  let mergeResult = processMerge({
    tag: 'example-dfu-static-framework',
    src: contents,
    newSrc: DFU_STATIC_FRAMEWORK,
    anchor: /target\s'example'\sdo/,
    offset: -1,
    comment: '#',
  })
  mergeResult = processMerge({
    tag: 'example-dfu-pod',
    src: mergeResult.contents,
    newSrc: DFU_POD,
    anchor: /post_install\sdo\s\|installer\|/,
    offset: -1,
    comment: '#',
  })

  await fs.promises.writeFile(file, mergeResult.contents, 'utf8')
  return dangerousMod
}

const withDFU: ConfigPlugin = (config) => {
  let newConfig = config
  newConfig = withAppDelegate(newConfig, (ios) => {
    ios.modResults = updateAppDelegate(ios.modResults)
    return ios
  })
  newConfig = withDangerousMod(newConfig, [
    'ios',
    async (ios) => {
      ios.modResults = await updatePodfile(ios.modRequest.platformProjectRoot, ios.modResults)
      return ios
    },
  ])
  return newConfig
}

export default withDFU
