/**
 * RNNordicDfu Native Module Spec
 *
 * @format
 */

'use strict';

/**
 * @typedef {Object} DFUOptions
 * @property {number} retries - Number of retries
 * @property {number} maxMtu - Maximum MTU size
 */

/**
 * TurboModule spec for RNNordicDfu
 *
 * @typedef {Object} RNNordicDfuSpec
 * @property {function(string, ?string, string, number, boolean): Promise<string>} startDFU - For iOS
 * @property {function(string, ?string, string, number, DFUOptions): Promise<string>} startDFU - For Android
 * @property {function(string): void} addListener - Add event listener
 * @property {function(number): void} removeListeners - Remove event listeners
 */

const { TurboModuleRegistry } = require('react-native');

/**
 * @type {RNNordicDfuSpec}
 */
const RNNordicDfu = TurboModuleRegistry.get('RNNordicDfu');

module.exports = RNNordicDfu;
