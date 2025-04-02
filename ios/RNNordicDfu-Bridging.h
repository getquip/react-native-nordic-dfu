#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <RNNordicDfu/RNNordicDfu.h>
#endif

@interface RNNordicDfu : RCTEventEmitter <RCTBridgeModule>

#ifdef RCT_NEW_ARCH_ENABLED
// New arch interface
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params;
#endif

@end
