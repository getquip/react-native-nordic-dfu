import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
export interface Spec extends TurboModule {
    startDFUiOS(deviceAddress: string, deviceName: string | null, filePath: string, packetReceiptNotificationParameter: number, alternativeAdvertisingNameEnabled: boolean): Promise<string>;
    startDFUAndroid(deviceAddress: string, deviceName: string | null, filePath: string, packetReceiptNotificationParameter: number, options: {
        retries: number;
        maxMtu: number;
    }): Promise<string>;
    addListener(eventType: string): void;
    removeListeners(count: number): void;
}
declare const _default: Spec;
export default _default;