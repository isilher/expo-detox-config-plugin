# Changelog

## 11.0.0 (2025-01-XX)

### Community Fork

This package is now community maintained after being removed from the official [expo/config-plugins](https://github.com/expo/config-plugins) repository.

**Initial Release:**
- Supports Expo SDK 53+
- Supports Detox 20.37.0+
- Extracted from expo/config-plugins@2387fa9
- Auto-configures Detox for Android when running `npx expo prebuild`

**Features:**
- Configures Android Gradle files for Detox support
- Generates Detox test class
- Manages network security config for Android
- Optional Proguard configuration

**Configuration Options:**
- `skipProguard` - Disable proguard minification
- `subdomains` - Configure allowed domains for network security

---

For historical changes prior to the community fork, see the [original repository](https://github.com/expo/config-plugins/tree/2387fa9/packages/detox).
