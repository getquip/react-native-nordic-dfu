module.exports = function withPlugins(config) {
  let newConfig = config
  // WARNING! DO NOT USE THE FOLDER NAME ios OR android!!!
  // It makes EAS break for unknown reasons
  newConfig = require('./plugins/example-ios/dfu/plugin.js').default(newConfig)
  newConfig = require('./plugins/example-android/ble/plugin.js').default(newConfig)
  return newConfig
}
