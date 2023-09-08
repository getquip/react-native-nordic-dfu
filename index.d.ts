declare module '@domir/react-native-nordic-dfu' {
  import { NativeEventEmitter } from 'react-native';
  import StrictEventEmitter from 'strict-event-emitter-types';
  export class NordicDFU {
    static startDFU({
      deviceAddress,
      deviceName,
      filePath,
      alternativeAdvertisingNameEnabled,
      packetReceiptNotificationParameter,
      retries,
      maxMtu,
    }: {
      deviceAddress: string;
      deviceName?: string;
      filePath: string | null;
      alternativeAdvertisingNameEnabled?: boolean;
      packetReceiptNotificationParameter?: number;
      retries?: number;
      maxMtu?: number;
    }): Promise<string>;

    static abortDFU(): Promise<boolean>;
  }

  export interface IDfuUpdate {
    deviceAddress: string;
    currentPart: number;
    partsTotal: number;
    percent: number;
    speed: number;
    avgSpeed: number;
  }

  export interface IStateUpdate {
    state?: 'DFU_ABORTED' | 'DFU_PROCESS_STARTING' | 'DFU_COMPLETED' | 'DFU_STATE_UPLOADING' | 'CONNECTING' | 'FIRMWARE_VALIDATING' | 'DEVICE_DISCONNECTING' | 'ENABLING_DFU_MODE' | 'UNKNOWN_STATE'
  }

  interface Events {
    DFUProgress: (state: IDfuUpdate) => void;
    DFUStateChanged: (state: IStateUpdate) => void;
  }

  type DFUEventEmitter = StrictEventEmitter<NativeEventEmitter, Events>;

  export const DFUEmitter: DFUEventEmitter
}
