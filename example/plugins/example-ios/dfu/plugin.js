"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
var config_plugins_1 = require("expo/config-plugins");
var fs = require("fs");
var path = require("path");
// whitespace is important!
var DFU_STATIC_FRAMEWORK = "\nstatic_frameworks = ['iOSDFULibrary']\npre_install do |installer|\n  installer.pod_targets.each do |pod|\n    if static_frameworks.include?(pod.name)\n      puts \"Overriding the static_frameworks? method for #{pod.name}\"\n      def pod.build_type;\n        Pod::BuildType.new(:linkage => :static, :packaging => :framework)\n      end\n    end\n  end\nend\n";
// whitespace is important!
var DFU_POD = "\n  pod \"react-native-nordic-dfu\", path: \"../node_modules/@getquip/react-native-nordic-dfu\"\n";
// whitespace is important!
var DFU_APP_DELEGATE_IMPORT = "\n// !!! Nordic DFU Expo Code Injection !!!\n#import \"RNNordicDfu.h\"\n// !!! Nordic DFU Expo Code Injection !!!\n";
// whitespace is important!
var DFU_APP_DELEGATE_GETTER = "\n  // !!! Nordic DFU Expo Code Injection !!!\n  [RNNordicDfu setCentralManagerGetter:^() {\n    return [[CBCentralManager alloc] initWithDelegate:nil queue:dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0)];\n  }];\n\n  // Reset manager delegate since the Nordic DFU lib \"steals\" control over it\n  [RNNordicDfu setOnDFUComplete:^() {\n    NSLog(@\"onDFUComplete\");\n  }];\n  [RNNordicDfu setOnDFUError:^() {\n    NSLog(@\"onDFUError\");\n  }];\n  // !!! Nordic DFU Expo Code Injection !!!\n";
var processMerge = function (_a) {
    var src = _a.src, newSrc = _a.newSrc, tag = _a.tag, anchor = _a.anchor, offset = _a.offset, comment = _a.comment;
    var mergeResult = (0, generateCode_1.mergeContents)({ src: src, newSrc: newSrc, tag: tag, anchor: anchor, offset: offset, comment: comment });
    if (!mergeResult.didMerge) {
        throw new Error('Failed modify file for DFU!');
    }
    return mergeResult;
};
var updateAppDelegate = function (appDelegate) {
    if (appDelegate.language === 'objcpp') {
        if (!appDelegate.contents.includes(DFU_APP_DELEGATE_IMPORT)) {
            appDelegate.contents = appDelegate.contents.replace(/(#import\s"AppDelegate\.h")(.*\s+)(#import <React\/RCTBundleURLProvider\.h>)/, "$1".concat(DFU_APP_DELEGATE_IMPORT, "\n$3"));
        }
        if (!appDelegate.contents.includes(DFU_APP_DELEGATE_GETTER)) {
            appDelegate.contents = appDelegate.contents.replace(/(didFinishLaunchingWithOptions:\(NSDictionary\s\*\)launchOptions\s{\s)(.*)(self\.moduleName = @"main";.*)/, "$1".concat(DFU_APP_DELEGATE_GETTER, "\n  $3"));
        }
    }
    else {
        console.warn('AppDelegate is not Obj-C. Unable to automatically configure DFU.');
    }
    return appDelegate;
};
var updatePodfile = function (platformProjectRoot, dangerousMod) { return __awaiter(void 0, void 0, void 0, function () {
    var file, contents, mergeResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                file = path.join(platformProjectRoot, 'Podfile');
                return [4 /*yield*/, fs.promises.readFile(file, 'utf8')];
            case 1:
                contents = _a.sent();
                mergeResult = processMerge({
                    tag: 'example-dfu-static-framework',
                    src: contents,
                    newSrc: DFU_STATIC_FRAMEWORK,
                    anchor: /target\s'example'\sdo/,
                    offset: -1,
                    comment: '#',
                });
                mergeResult = processMerge({
                    tag: 'example-dfu-pod',
                    src: mergeResult.contents,
                    newSrc: DFU_POD,
                    anchor: /post_install\sdo\s\|installer\|/,
                    offset: -1,
                    comment: '#',
                });
                return [4 /*yield*/, fs.promises.writeFile(file, mergeResult.contents, 'utf8')];
            case 2:
                _a.sent();
                return [2 /*return*/, dangerousMod];
        }
    });
}); };
var withDFU = function (config) {
    var newConfig = config;
    newConfig = (0, config_plugins_1.withAppDelegate)(newConfig, function (ios) {
        ios.modResults = updateAppDelegate(ios.modResults);
        return ios;
    });
    newConfig = (0, config_plugins_1.withDangerousMod)(newConfig, [
        'ios',
        function (ios) { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = ios;
                        return [4 /*yield*/, updatePodfile(ios.modRequest.platformProjectRoot, ios.modResults)];
                    case 1:
                        _a.modResults = _b.sent();
                        return [2 /*return*/, ios];
                }
            });
        }); },
    ]);
    return newConfig;
};
exports.default = withDFU;
