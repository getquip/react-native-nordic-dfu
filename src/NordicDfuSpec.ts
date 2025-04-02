import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
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

  // Android implementation with different parameter structure
  // The interface will handle this based on platform
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
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNNordicDfu');
