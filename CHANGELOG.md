# Changelog

## 12.0.0 (2025-11-XX)

### Expo SDK 54 Support

**Breaking Changes:**
- Updated to support Expo SDK 54
- Minimum required versions:
  - Expo SDK 54.0.0+
  - React Native 0.81+
  - Detox 20.46.0+
  - Node 20.19.4+

**Dependency Updates:**
- `expo` peer dependency: `^53.0.0` → `^54.0.0`
- `@expo/config-plugins` peer dependency: `~9.0.0` → `~54.0.0`
- `expo-build-properties`: `^0.13.1` → `^1.0.9`
- `typescript`: `^5.1.3` → `^5.9.2`

**Migration:**
Users on Expo SDK 53 should continue using version 11.x of this package.

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
