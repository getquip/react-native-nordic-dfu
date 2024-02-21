require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-nordic-dfu"
  s.version      = package["version"]
  s.summary      = package["description"]

  s.authors      = { package["author"] => "" }
  s.homepage     = "https://github.com/getquip/react-native-nordic-dfu"
  s.license      = "MIT"
  s.platform     = :ios, "17.0"

  s.source       = { :git => "https://github.com/getquip/react-native-nordic-dfu.git" }
  s.source_files  = "ios/**/*.{h,m}"

  s.dependency "React-Core"
  s.dependency "iOSDFULibrary", "~> 4.14.0"
end
