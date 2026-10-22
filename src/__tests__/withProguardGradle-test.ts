import fs from "fs";
import path from "path";

import { addDetoxProguardRules } from "../withProguardGradle";

const buildGradleFixture = (defaultProguardFile: string) => `

android {
    compileSdkVersion rootProject.ext.compileSdkVersion

    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.debug
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("${defaultProguardFile}"), "proguard-rules.pro"
        }
    }
}
`;
const buildGradleWithoutProguardFixture = `

android {
    compileSdkVersion rootProject.ext.compileSdkVersion

    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.debug
        }
    }
}
`;
// What versions up to 13.0.0 of this plugin wrote: Detox's rules only.
const buildGradleWithDetoxRulesOnlyFixture = buildGradleFixture(
  "proguard-android.txt",
).replace(
  `"proguard-rules.pro"\n`,
  `"proguard-rules.pro"
            // Detox-specific additions to pro-guard
            def detoxProguardRulesPath = new File(["node", "--print", "require.resolve('detox/package.json')"].execute(null, rootDir).text.trim(), "../android/detox/proguard-rules-app.pro")
            proguardFile(detoxProguardRulesPath)
            \n`,
);

describe(addDetoxProguardRules, () => {
  it.each(["proguard-android.txt", "proguard-android-optimize.txt"])(
    `adds proguard rules to gradle (%s)`,
    (defaultProguardFile) => {
      const applied = addDetoxProguardRules(
        buildGradleFixture(defaultProguardFile),
      );
      expect(applied).toMatchSnapshot();
      expect(applied).toMatch(/proguardFile\(detoxProguardRulesPath\)/);
      expect(applied).toMatch(/proguardFile\(detoxPluginProguardRulesPath\)/);
    },
  );
  it(`doesn't add proguard rules to gradle if proguard is missing from the template`, () => {
    expect(
      addDetoxProguardRules(buildGradleWithoutProguardFixture),
    ).not.toMatch(/detox/);
  });
  it(`doesn't duplicate`, () => {
    const applied = addDetoxProguardRules(
      buildGradleFixture("proguard-android-optimize.txt"),
    );
    expect(addDetoxProguardRules(applied)).toStrictEqual(applied);
  });
  it(`adds the plugin rules to a project prebuilt with Detox's rules only`, () => {
    const applied = addDetoxProguardRules(buildGradleWithDetoxRulesOnlyFixture);
    expect(applied.match(/def detoxProguardRulesPath/g)).toHaveLength(1);
    expect(applied).toMatch(
      /proguardFile\(detoxProguardRulesPath\)\n.*def detoxPluginProguardRulesPath/,
    );
  });
});

describe("proguard-rules-detox.pro", () => {
  const root = path.join(__dirname, "../..");

  it("is published with the package", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(root, "package.json"), "utf8"),
    );
    expect(pkg.files).toContain("proguard-rules-detox.pro");
    expect(fs.existsSync(path.join(root, "proguard-rules-detox.pro"))).toBe(
      true,
    );
  });
});
