
declare module 'react-native-nordic-dfu' {
  import StrictEventEmitter from 'strict-event-emitter-types';
  import {NativeEventEmitter} from 'react-native'
  export class NordicDFU {
    static startDFU({
      deviceAddress,
      deviceName,
      filePath
    }: {
      deviceAddress: string;
      deviceName?: string;
      filePath: string | null;
    }): Promise<string>;

    static abortDFU(): Promise<boolean>;
  }

  export interface IDfuUpdate {
    percent?: number;
    currentPart?: number;
    partsTotal?: number;
    avgSpeed?: number;
    speed?: number;
  }

  export interface IStateUpdate {
    state?: 'DFU_ABORTED' | 'DFU_PROCESS_STARTING' | 'DFU_COMPLETED' | 'DFU_STATE_UPLOADING' | 'CONNECTING' | 'FIRMWARE_VALIDATING' | 'DEVICE_DISCONNECTING' | 'ENABLING_DFU_MODE' | 'UNKNOWN_STATE'
  }

  interface Events {
    DFUProgress: (state: IDfuUpdate) => void;
    DFUStateChanged: (state: IStateUpdate) => void;
  }

  type DFUEventEmitter = StrictEventEmitter<NativeEventEmitter, Events>;

  export class DFUEmitter extends NativeEventEmitter {}
}
