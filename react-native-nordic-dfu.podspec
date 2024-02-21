require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-nordic-dfu"
  s.version      = package["version"]
  s.summary      = package["description"]

  s.authors      = { package["author"] => "" }
  s.homepage     = package["url"]
  s.license      = package["license"]
  s.platform     = :ios, "16.0"

  s.source       = { :git => package["url"] + ".git" }
  s.source_files  = "ios/**/*.{h,m}"

  s.dependency "React-Core"
  s.dependency "iOSDFULibrary", "~> 4.14.0"
end
