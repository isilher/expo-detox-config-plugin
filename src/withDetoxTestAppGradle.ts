import { type ConfigPlugin, withAppBuildGradle } from "@expo/config-plugins";

/**
 * [Step 3](https://github.com/wix/Detox/blob/master/docs/Introduction.Android.md#3-add-the-native-detox-dependency). Add the Native Detox dependency.
 *
 * 1. Add `androidTestImplementation` to the app/build.gradle
 * 2. Add `testInstrumentationRunner` to the app/build.gradle
 * @param config
 */
const withDetoxTestAppGradle: ConfigPlugin = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      config.modResults.contents = setGradleAndroidTestImplementation(
        config.modResults.contents,
      );
      config.modResults.contents = addDetoxDefaultConfigBlock(
        config.modResults.contents,
      );
      config.modResults.contents = addDependencyResolutionStrategy(
        config.modResults.contents,
      );
    } else {
      throw new Error(
        "Cannot add Detox maven gradle because the project build.gradle is not groovy",
      );
    }
    return config;
  });
};

export function setGradleAndroidTestImplementation(
  buildGradle: string,
): string {
  buildGradle = pushGradleDependency(
    buildGradle,
    "implementation 'androidx.appcompat:appcompat:1.6.1'",
  );

  // Detox dependency (20.44.0+ required for React Native 0.81 support)
  // AndroidX Test dependencies come transitively from Detox
  buildGradle = pushGradleDependency(
    buildGradle,
    "androidTestImplementation('com.wix:detox:+')",
  );

  return buildGradle;
}

function escapeStringRegexp(str: string) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}

export function pushGradleDependency(
  buildGradle: string,
  dependency: string,
): string {
  const pattern = new RegExp(escapeStringRegexp(dependency), "g");
  if (buildGradle.match(pattern)) {
    return buildGradle;
  }
  return buildGradle.replace(
    /dependencies\s?{/,
    `dependencies {
    ${dependency}`,
  );
}

export function addDetoxDefaultConfigBlock(buildGradle: string): string {
  const pattern = /detox-plugin-default-config/g;
  if (buildGradle.match(pattern)) {
    return buildGradle;
  }

  return buildGradle.replace(
    /defaultConfig\s?{/,
    `defaultConfig {
        // detox-plugin-default-config
        testBuildType System.getProperty('testBuildType', 'debug')
        testInstrumentationRunner 'androidx.test.runner.AndroidJUnitRunner'`,
  );
}

export function addDependencyResolutionStrategy(buildGradle: string): string {
  const pattern = /detox-plugin-resolution-strategy/g;
  if (buildGradle.match(pattern)) {
    return buildGradle;
  }

  // Force androidx.test dependency versions to match what Detox expects
  // This resolves conflicts when other dependencies require older versions
  const resolutionStrategy = `
    // detox-plugin-resolution-strategy
    configurations.all {
        resolutionStrategy {
            force 'androidx.test:core:1.6.1'
            force 'androidx.test:runner:1.6.1'
            force 'androidx.test:rules:1.6.1'
            force 'androidx.test:monitor:1.7.1'
            force 'androidx.test.ext:junit:1.2.1'
            force 'androidx.test.espresso:espresso-core:3.6.1'
        }
    }
`;

  return buildGradle.replace(/android\s*{/, `android {${resolutionStrategy}`);
}

export default withDetoxTestAppGradle;
