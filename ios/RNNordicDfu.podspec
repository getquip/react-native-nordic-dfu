require "json"

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name         = "RNNordicDfu"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = package["description"]
  s.license      = package['license']
  s.author       = package['author']
  s.homepage     = package["homepage"] || package["url"]

  s.platform     = :ios, "16.0"
  s.ios.deployment_target = "16.0"

  s.source       = { :git => "#{package["repository"]["url"]}.git", :tag => s.version }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.dependency "React-Core"
  s.dependency "iOSDFULibrary", "~> 4.15.3"

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
