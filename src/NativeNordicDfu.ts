import { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  // iOS implementation
  startDFUiOS(
    deviceAddress: string,
    deviceName: string | null,
    filePath: string,
    packetReceiptNotificationParameter: number,
    alternativeAdvertisingNameEnabled: boolean
  ): Promise<string>;

  // Android implementation
  startDFUAndroid(
    deviceAddress: string,
    deviceName: string | null,
    filePath: string,
    packetReceiptNotificationParameter: number,
    options: {
      retries: number,
      maxMtu: number,
    }
  ): Promise<string>;

  // Add any other native methods used by the module
  addListener(eventType: 'DFUProgress' | 'DFUStateChanged'): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNNordicDfu');