import { NativeEventEmitter } from "react-native";
declare const NordicDFU: {
    startDFU: typeof startDFU;
};
/**
 * Starts the DFU process
 *
 * @param {Object} obj
 * @param {string} obj.deviceAddress The MAC address for the device that should be updated
 * @param {string} [obj.deviceName = null] The name of the device in the update notification
 * @param {string} obj.filePath The file system path to the zip-file used for updating
 * @param {Boolean} obj.alternativeAdvertisingNameEnabled Send unique name to device before it is switched into bootloader mode (iOS only)
 * @param {number} obj.packetReceiptNotificationParameter set number of packets of firmware data to be received by the DFU target before sending a new Packet Receipt Notification
 * @returns {Promise} A promise that resolves or rejects with the `deviceAddress` in the return value
 */
declare function startDFU({ deviceAddress, deviceName, filePath, alternativeAdvertisingNameEnabled, //iOS only
packetReceiptNotificationParameter, retries, // Android only
maxMtu, }: {
    deviceAddress: string;
    deviceName?: string | null;
    filePath: string;
    alternativeAdvertisingNameEnabled?: boolean;
    packetReceiptNotificationParameter?: number;
    retries?: number;
    maxMtu?: number;
}): Promise<string>;
/**
 * Event emitter for DFU state and progress events
 */
declare const DFUEmitter: NativeEventEmitter;
export { NordicDFU, DFUEmitter };