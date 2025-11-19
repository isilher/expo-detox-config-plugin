# @config-plugins/detox

> **Community Maintained** - This package was removed from the official [expo/config-plugins](https://github.com/expo/config-plugins) repository and is now maintained separately to continue supporting Detox integration with Expo.

Config plugin to auto-configure Detox when the native code is generated (`npx expo prebuild`).

## Requirements

- **Expo SDK:** 54.0.0 or higher
- **React Native:** 0.81 or higher
- **Detox:** 20.46.0 or higher
- **Node:** 20.19.4 or higher

> **Note:** For Expo SDK 53, use version 11.x of this package. For older SDK versions (50-52), use the original [@config-plugins/detox](https://www.npmjs.com/package/@config-plugins/detox) package from the expo/config-plugins repository.

## Installation

Install the package along with Detox:

```bash
npx expo install detox @config-plugins/detox
```

## Setup

1. Add the plugin to your `app.json` or `app.config.js`:

   ```json
   {
     "expo": {
       "plugins": ["@config-plugins/detox"]
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
        "@config-plugins/detox",
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
        "@config-plugins/detox",
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

## 📝 Notes

- [Detox docs](https://wix.github.io/Detox/docs/introduction/getting-started/)
