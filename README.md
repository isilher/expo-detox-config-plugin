# expo-detox-config-plugin

Config plugin to auto-configure Detox when the native code is generated (`npx expo prebuild`).

## 📋 Version Compatibility

This plugin is designed for **Expo SDK 54 and above**.

| Expo SDK | Use This Package |
|----------|------------------|
| **≥ 54** | `expo-detox-config-plugin@^13.0.0` (this package) |
| **≤ 53** | Original package from [expo/config-plugins](https://www.npmjs.com/package/@config-plugins/detox) |

> **Note:** The official Expo team removed Detox support from their config-plugins repository. This community-maintained fork continues support starting from SDK 54.

## Requirements

- **Expo SDK:** 54.0.0 or higher
- **React Native:** 0.81 or higher
- **Detox:** 20.44.0 or higher (required for React Native 0.81 support)
- **Node:** 22.13.0 or higher

## Installation

Install the package along with Detox:

```bash
npx expo install detox expo-detox-config-plugin
```

## Setup

1. Add the plugin to your `app.json` or `app.config.js`:

   ```json
   {
     "expo": {
       "plugins": ["expo-detox-config-plugin"]
     }
   }
   ```

2. Install additional testing dependencies:

   ```bash
   yarn add -D @babel/core @babel/runtime @types/jest babel-jest jest jest-circus ts-jest
   ```

3. Generate the native code:

   ```bash
   npx expo prebuild
   ```

4. Initialize Detox configuration:

   ```bash
   yarn detox init -r jest
   ```

5. For iOS, install pods:

   ```bash
   npx pod-install
   ```

## Configuration

The plugin provides props for extra customization. Every time you change the props or plugins, you'll need to rebuild (and `prebuild`) the native app. If no extra properties are added, defaults will be used.

### Options

- **`skipProguard`** (_boolean_): Disable adding proguard minification to the `app/build.gradle`. Defaults to `false`.
- **`subdomains`** (_string[] | '\*'_): Hostnames to add to the network security config. Pass `'*'` to allow all domains. Defaults to `['10.0.2.2', 'localhost']`.

### Example Configuration

**app.config.js:**

```js
export default {
  expo: {
    plugins: [
      [
        "expo-detox-config-plugin",
        {
          skipProguard: false,
          subdomains: ["10.0.2.2", "localhost"],
        },
      ],
    ],
  },
};
```

**Advanced example with environment-based configuration:**

```js
module.exports = {
  expo: {
    plugins: [
      [
        "expo-detox-config-plugin",
        {
          subdomains:
            process.env.EAS_BUILD_PROFILE === "development"
              ? "*"
              : ["10.0.2.2", "localhost"],
        },
      ],
    ],
  },
};
```

## What This Plugin Does

This plugin automatically configures your Android and iOS projects for Detox testing:

### Android
- Adds Detox dependency to `app/build.gradle`
- Configures test instrumentation runner
- Adds ProGuard rules for release builds
- **Resolves AndroidX Test dependency conflicts** by forcing compatible versions
- Configures network security for test environments

### iOS
- Adds Detox pod dependency
- Configures build settings for testing

## FAQ

If the following commands fail, you can get better debug info by running a subset command:

- `yarn e2e:ios`: `yarn ios` (builds the iOS app). xcodebuild compile errors may show in a more helpful format (using xcpretty).
- `yarn e2e:android`: `yarn android` (builds the Android app). Android compile errors may show in a more helpful format.

### `yarn e2e:android` failed

If you get the error:

```sh
detox[98696] ERROR: DetoxRuntimeError: Cannot boot Android Emulator with the name: 'Pixel_API_28'

HINT: Make sure you choose one of the available emulators: Pixel_3_API_30,Pixel_6_Pro_API_33,Pixel_C_API_30
```

Be sure to change the first emulator name (in my case "Pixel_API_28") with one of the suggested emulators (in my case Pixel_3_API_30, Pixel_6_Pro_API_33, Pixel_C_API_30), in the `detox.config.js` file under `devices.emulator.device.avdName`. More emulators can be created in Android Studio.

---

If you get the error:

```sh
Error: app binary not found at '/Users/.../with-detox/android/app/build/outputs/apk/debug/app-debug.apk', did you build it
```

It means the build step failed, ensure running `yarn android`, and `yarn build:android` works before trying `yarn e2e:android` again.

---

If you get the error:

```sh
PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target
```

Be sure to disable any proxies running on your computer that may be blocking requests (i.e. Charles Proxy). You may need to run `yarn clean:android` before attempting to build again.

---

If you get the error:

```sh
CLEARTEXT communication to [some host] not permitted by network security policy
```

This means you're attempting to connect over plain HTTP (not HTTPS) to a host that _isn't_ in your `subdomains` settings (defaults to `['10.0.2.2', 'localhost']`). See the [Configuration](#configuration) section above for examples on how to configure `subdomains`, including how to allow all domains with `"*"` for development builds.

## 🙏 Acknowledgments

A huge thank you to [@EvanBacon](https://github.com/EvanBacon) and the Expo team for creating and maintaining the original Detox config plugin through Expo SDK 53. Their excellent work laid the foundation for this community fork, making it possible to continue supporting Detox integration with Expo for SDK 54 and beyond.

## 📝 Notes

- [Detox docs](https://wix.github.io/Detox/docs/introduction/getting-started/)
- [Original expo/config-plugins Detox plugin](https://www.npmjs.com/package/@config-plugins/detox) (for SDK ≤ 53)
