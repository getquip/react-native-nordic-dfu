import { Platform } from "react-native";
import { Spec } from "./NativeNordicDfu";

let platformDfu: Spec

try {
  platformDfu = require('./NativeNordicDfu').default;
} catch {
  platformDfu = require('./NativeNordicDfu.legacy').default;
}

function rejectPromise(message: string): Promise<never> {
  return Promise.reject(new Error(`NordicDFU.startDFU: ${message}`));
}

function startDFU({
  deviceAddress,
  deviceName = '',
  filePath,
  packetReceiptNotificationParameter = 12,
  alternativeAdvertisingNameEnabled = true, //iOS only
  retries = 3, // Android only
  maxMtu = 23, // Android only
}: {
  deviceAddress: string;
  deviceName?: string;
  filePath: string;
  packetReceiptNotificationParameter?: number;
  alternativeAdvertisingNameEnabled?: boolean;
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
    return platformDfu.startDFUiOS(
      upperDeviceAddress,
      deviceName,
      filePath,
      packetReceiptNotificationParameter,
      alternativeAdvertisingNameEnabled
    );
  } else if (Platform.OS === "android") {
    return platformDfu.startDFUAndroid(
      upperDeviceAddress,
      deviceName,
      filePath,
      packetReceiptNotificationParameter,
      retries,
      maxMtu,
    );
  } else {
    throw new Error("Platform not supported (not android or ios)");
  }
}

const RNNordicDfu = { startDFU, ...platformDfu}

export default RNNordicDfu;
export type { Spec } from './NativeNordicDfu';
declare const global: typeof globalThis;
export const isTurboModuleEnabled = global.__turboModuleProxy != null;
