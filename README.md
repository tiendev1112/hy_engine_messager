# hy_engine_messager

## IOS install && start
  ```md
  yarn install
  npx pod-install
  react-native run-ios
  ```

### Android install && start
<details><summary>If Release Crash</summary>
Add this line to `android/gradle.properties`:

```
android.enableDexingArtifactTransform.desugaring=false

```
</details>
```
yarn install
react-native link react-native-vector-icons
react-native run-android
```