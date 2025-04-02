#import <CoreBluetooth/CoreBluetooth.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
@import NordicDFU;

NS_ASSUME_NONNULL_BEGIN

@interface RNNordicDfu : RCTEventEmitter <RCTBridgeModule, DFUServiceDelegate, DFUProgressDelegate, LoggerDelegate>

@property (nonatomic, strong, nullable) NSString *deviceAddress;
@property (nonatomic, copy, nullable) RCTPromiseResolveBlock resolve;
@property (nonatomic, copy, nullable) RCTPromiseRejectBlock reject;
@property (nonatomic, strong, nullable) DFUServiceController *controller;

+ (void)setCentralManagerGetter:(CBCentralManager * _Nonnull (^)(void))getter;
+ (void)setOnDFUComplete:(void (^_Nonnull)(void))onComplete;
+ (void)setOnDFUError:(void (^_Nonnull)(void))onError;

@end

NS_ASSUME_NONNULL_END
