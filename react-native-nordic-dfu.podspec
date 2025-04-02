require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-nordic-dfu"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = package["description"]
  s.authors      = { package["author"] => "" }
  s.homepage     = package["homepage"] || package["url"]
  s.license      = { :type => package["license"] }

  s.platform     = :ios, "16.0"
  s.ios.deployment_target = "16.0"

  s.source       = { :git => "#{package["repository"]["url"]}.git", :tag => s.version }
  s.source_files = "ios/**/*.{h,m}"

  s.pod_target_xcconfig = {
    "DEFINES_MODULE" => "YES",
    "CLANG_ENABLE_MODULES" => "YES"
  }

  s.static_framework = true

  s.dependency "React-Core"
  s.dependency "iOSDFULibrary", "~> 4.15.3"
end
