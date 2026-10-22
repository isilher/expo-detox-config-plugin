import {
  type ConfigPlugin,
  WarningAggregator,
  withAppBuildGradle,
} from "@expo/config-plugins";

/**
 * [Step 7](https://github.com/wix/Detox/blob/master/docs/Introduction.Android.md#7-proguard-minification-obfuscation). Add Proguard (Minification, Obfuscation) to the app/build.gradle.
 *
 * 1. Add Detox's `proguard-rules-app.pro` to the release build type
 * 2. Add this plugin's `proguard-rules-detox.pro`, which keeps the parts of the
 *    Kotlin stdlib and kotlinx.coroutines that Detox's own rules miss
 * @param config
 */
const withProguardGradle: ConfigPlugin = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      const contents = addDetoxProguardRules(config.modResults.contents);
      if (!contents.includes(PLUGIN_RULES_MARKER)) {
        WarningAggregator.addWarningAndroid(
          "expo-detox-config-plugin",
          'Could not add the Detox ProGuard rules: no `proguardFiles getDefaultProguardFile(...), "proguard-rules.pro"` line in app/build.gradle. Minified release builds may break Detox. Pass `skipProguard: true` to silence this.',
        );
      }
      config.modResults.contents = contents;
    } else {
      throw new Error(
        "Cannot add Detox maven gradle because the project build.gradle is not groovy",
      );
    }
    return config;
  });
};

// The default proguardFiles line of the release build type. Expo templates
// use "proguard-android-optimize.txt", older React Native templates
// "proguard-android.txt".
const PROGUARD_FILES_PATTERN =
  /proguardFiles getDefaultProguardFile\("proguard-android(?:-optimize)?\.txt"\),\s?"proguard-rules\.pro"/;

const DETOX_RULES_MARKER = "detox/proguard-rules-app.pro";
const DETOX_RULES = `
            // Detox-specific additions to pro-guard
            def detoxProguardRulesPath = new File(["node", "--print", "require.resolve('detox/package.json')"].execute(null, rootDir).text.trim(), "../android/detox/proguard-rules-app.pro")
            proguardFile(detoxProguardRulesPath)`;

const PLUGIN_RULES_MARKER = "proguard-rules-detox.pro";
const PLUGIN_RULES = `
            def detoxPluginProguardRulesPath = new File(["node", "--print", "require.resolve('expo-detox-config-plugin/package.json')"].execute(null, rootDir).text.trim(), "../proguard-rules-detox.pro")
            proguardFile(detoxPluginProguardRulesPath)`;

export function addDetoxProguardRules(buildGradle: string): string {
  let contents = buildGradle;

  if (!contents.includes(DETOX_RULES_MARKER)) {
    contents = contents.replace(
      PROGUARD_FILES_PATTERN,
      (proguardFiles) => proguardFiles + DETOX_RULES,
    );
  }

  // Added separately so projects prebuilt with an older version of this
  // plugin (Detox rules only) get the extra rules too.
  if (
    contents.includes(DETOX_RULES_MARKER) &&
    !contents.includes(PLUGIN_RULES_MARKER)
  ) {
    contents = contents.replace(
      "proguardFile(detoxProguardRulesPath)",
      (detoxProguardFile) => detoxProguardFile + PLUGIN_RULES,
    );
  }

  return contents;
}

export default withProguardGradle;
