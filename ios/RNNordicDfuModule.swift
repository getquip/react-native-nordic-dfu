import ExpoModulesCore

@objc(RNNordicDfuModule)
public class RNNordicDfuModule: NSObject, Module {
  public func definition() -> ModuleDefinition {
    Name("RNNordicDfu")

    // stub for the native module
    AsyncFunction("noop") {
      print("RNNordicDfuModule loaded (noop)")
    }
  }
}
