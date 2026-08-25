# Changelog

## 13.0.0

### Expo SDK 57 Support

**Supported Versions:**
- Expo SDK: 54.0.0+
- React Native: 0.81+
- Detox: 20.44.0+ (required for React Native 0.81 support)
- Node: 22.13.0+

**Changes:**
- Widened peer dependency ranges to `>=54.0.0` for both `@expo/config-plugins` and `expo`, so a single version of the plugin works across SDK 54–57+
- Removed unused `expo-build-properties` runtime dependency — the plugin never imported it, and dropping it eliminates a redundant install
- Updated dev dependencies to SDK 57 (`@expo/config-plugins@~57.0.0`, `expo@^57.0.0`, `jest@^30.4.2`, `@react-native/jest-preset@^0.87.0`)
- Updated publish workflow to Node 22 (required by `@react-native/jest-preset@0.87`)

---

## 12.0.0

### Initial Release for Expo SDK 54+

This is a community-maintained config plugin for Detox, supporting **Expo SDK 54 and above**. The official Expo team removed Detox support from their config-plugins repository, and this fork continues support starting from SDK 54.

**Supported Versions:**
- Expo SDK: 54.0.0+
- React Native: 0.81+
- Detox: 20.44.0+ (required for React Native 0.81 support)
- Node: 20.19.4+

**Features:**
- Auto-configures Android and iOS projects for Detox testing
- Adds Detox dependencies to Gradle and Podfile
- Configures test instrumentation runner
- Adds ProGuard rules for release builds
- **Resolves AndroidX Test dependency conflicts** with automatic version resolution strategy
- Manages network security config for Android test environments

**Configuration Options:**
- `skipProguard` (_boolean_) - Disable proguard minification (default: `false`)
- `subdomains` (_string[] | '*'_) - Configure allowed domains for network security (default: `['10.0.2.2', 'localhost']`)

**Technical Changes:**
- Updated peer dependencies for SDK 54:
  - `expo`: `^54.0.0`
  - `@expo/config-plugins`: `~54.0.0`
- Updated dependencies:
  - `expo-build-properties`: `^1.0.9`
  - `typescript`: `^5.9.2`
- Added Gradle dependency resolution strategy to force compatible AndroidX Test versions
- Removed explicit AndroidX Test dependencies (now handled transitively by Detox)

**Package Name:**
This package is published as `expo-detox-config-plugin` on npm.

**For Expo SDK 53 and below:**
Please use the original [@config-plugins/detox](https://www.npmjs.com/package/@config-plugins/detox) package from the expo/config-plugins repository.

---

## Previous Versions

This package is a continuation of the official Detox config plugin that was maintained by the Expo team until SDK 53. For historical changes and versions prior to SDK 54, see the [original expo/config-plugins repository](https://github.com/expo/config-plugins).

---

## Acknowledgments

Special thanks to [@EvanBacon](https://github.com/EvanBacon) and the Expo team for their excellent work creating and maintaining the original Detox config plugin through SDK 53. This community fork builds upon their solid foundation.
