# Added by expo-detox-config-plugin on top of Detox's proguard-rules-app.pro.
#
# The androidTest APK leaves out libraries the app already ships and uses the
# app's copies at runtime. When the app is minified, R8 strips or renames
# everything the app itself does not need, and Detox's test-side code then
# fails with NoClassDefFoundError. Detox's own list misses parts of the Kotlin
# stdlib and kotlinx.coroutines, for example kotlin.TuplesKt, which Detox's
# invoke handler and crash handler use: the Detox client dies on the first
# command and the test run reports "Detox can't seem to connect to the test
# app(s)". Seen with AGP 9 (Expo SDK 58).
-keep class kotlin.** { *; }
-keep class kotlinx.coroutines.** { *; }
