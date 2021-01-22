# hy_engine_messager

## IOS install && start
  ```
  yarn install
  npx pod-install
  react-native run-ios
  ```

## Android install && start
<details><summary>If Release Crash</summary>
`react-native-webrtc` android install error

Add this line to `android/gradle.properties`:

```
android.enableDexingArtifactTransform.desugaring=false

```
</details>

  ```
  yarn install
  npx pod-install
  react-native run-ios
  ```