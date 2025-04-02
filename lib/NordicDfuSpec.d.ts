import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
export interface Spec extends TurboModule {
    startDFU(deviceAddress: string, deviceName: string | null, filePath: string, packetReceiptNotificationParameter: number, alternativeAdvertisingNameEnabled: boolean): Promise<string>;
    startDFU(deviceAddress: string, deviceName: string | null, filePath: string, packetReceiptNotificationParameter: number, options: {
        retries: number;
        maxMtu: number;
    }): Promise<string>;
}
declare const _default: Spec;
export default _default;
