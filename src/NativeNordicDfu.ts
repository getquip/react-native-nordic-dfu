import { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  // iOS implementation
  startDFU(
    deviceAddress: string,
    deviceName: string | null,
    filePath: string,
    packetReceiptNotificationParameter: number,
    alternativeAdvertisingNameEnabled: boolean
  ): Promise<string>;

  // Android implementation
  startDFU(
    deviceAddress: string,
    deviceName: string | null,
    filePath: string,
    packetReceiptNotificationParameter: number,
    options: {
      retries: number,
      maxMtu: number,
    }
  ): Promise<string>;

  // Event constants
  DFUProgress: string;
  DFUStateChanged: string;

  // Add any other native methods used by the module
  addListener(eventType: string): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNNordicDfu');