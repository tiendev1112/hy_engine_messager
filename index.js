/**
 * @format
 */

 import {AppRegistry} from 'react-native';
 import 'node-libs-react-native/globals';
 // If you are using react-native-get-random-values:
 import 'react-native-get-random-values';
 
 import App from './App';
 import {name as appName} from './app.json';
 
 AppRegistry.registerComponent(appName, () => App);
 