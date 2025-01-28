"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_plugins_1 = require("expo/config-plugins");
var resetPermissions = function (androidManifest) {
    config_plugins_1.AndroidConfig.Permissions.removePermissions(androidManifest, ['android.permission.BLUETOOTH_SCAN']);
    if (!Array.isArray(androidManifest.manifest['uses-permission'])) {
        androidManifest.manifest['uses-permission'] = [];
    }
    if (!Array.isArray(androidManifest.manifest['uses-feature'])) {
        androidManifest.manifest['uses-feature'] = [];
    }
    return androidManifest;
};
var updatePermissions = function (androidManifest) {
    var _a, _b;
    (_a = androidManifest.manifest['uses-permission']) === null || _a === void 0 ? void 0 : _a.push({
        $: {
            'android:name': 'android.permission.BLUETOOTH_SCAN',
            // @ts-ignore: type definition is incorrect
            'android:usesPermissionFlags': 'neverForLocation',
        },
    });
    (_b = androidManifest.manifest['uses-feature']) === null || _b === void 0 ? void 0 : _b.push({
        $: {
            'android:name': 'android.hardware.bluetooth_le',
            'android:required': 'true',
        },
    });
    return androidManifest;
};
var withBLE = function (config) {
    return (0, config_plugins_1.withAndroidManifest)(config, function (android) {
        android.modResults = resetPermissions(android.modResults);
        android.modResults = updatePermissions(android.modResults);
        return android;
    });
};
exports.default = withBLE;
