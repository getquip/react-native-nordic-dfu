import { NativeModules, NativeEventEmitter, Platform } from "react-native";
import type { Spec } from "./NativeNordicDfu";

// Use the correct module based on architecture
// This handles automatic switching between legacy NativeModules and TurboModules
let RNNordicDfu: Spec;
try {
  // When using TurboModules, this import will succeed
  const NordicDfuModule = require("./NativeNordicDfu").default;
  RNNordicDfu = NordicDfuModule;
} catch (e) {
  // Fallback to the old architecture
  RNNordicDfu = NativeModules.RNNordicDfu;
}

const NordicDFU = { startDFU };

function rejectPromise(message: string): Promise<never> {
  return new Promise((resolve, reject) => {
    reject(new Error("NordicDFU.startDFU: " + message));
  });
}

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
function startDFU({
  deviceAddress,
  deviceName = null,
  filePath,
  alternativeAdvertisingNameEnabled = true, //iOS only
  packetReceiptNotificationParameter = 12,
  retries = 3, // Android only
  maxMtu = 23, // Android only
}: {
  deviceAddress: string;
  deviceName?: string | null;
  filePath: string;
  alternativeAdvertisingNameEnabled?: boolean;
  packetReceiptNotificationParameter?: number;
  retries?: number;
  maxMtu?: number;
}): Promise<string> {
  if (deviceAddress == undefined) {
    return rejectPromise("No deviceAddress defined");
  }
  if (filePath == undefined) {
    return rejectPromise("No filePath defined");
  }
  const upperDeviceAddress = deviceAddress.toUpperCase();
  if (Platform.OS === "ios") {
    return RNNordicDfu.startDFU(
      upperDeviceAddress,
      deviceName,
      filePath,
      packetReceiptNotificationParameter,
      alternativeAdvertisingNameEnabled
    );
  } else if (Platform.OS === "android") {
    return RNNordicDfu.startDFU(
      upperDeviceAddress,
      deviceName,
      filePath,
      packetReceiptNotificationParameter,
      {
        retries,
        maxMtu,
      }
    );
  } else {
    throw new Error("Platform not supported (not android or ios)");
  }
}

/**
 * Event emitter for DFU state and progress events
 */
const DFUEmitter = new NativeEventEmitter(RNNordicDfu);

export { NordicDFU, DFUEmitter };
