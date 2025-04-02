import { TurboModuleRegistry } from 'react-native';
import type { TurboModule } from 'react-native';

export interface Spec extends TurboModule {
  startDFUiOS(
    deviceAddress: string,
    deviceName: string,
    filePath: string,
    packetReceiptNotificationParameter: number,
    alternativeAdvertisingNameEnabled: boolean
  ): Promise<string>;

  startDFUAndroid(
    deviceAddress: string,
    deviceName: string,
    filePath: string,
    packetReceiptNotificationParameter: number,
    retries: number,
    maxMtu: number
  ): Promise<string>;

  abortDFU: () => Promise<boolean>;

  addListener(eventType: 'DFUProgress' | 'DFUStateChanged'): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNNordicDfu');
