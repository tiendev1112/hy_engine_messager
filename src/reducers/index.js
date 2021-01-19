import {combineReducers} from 'redux';
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginReducer from './login/LoginReducer';
import DialogReducer from './main/DialogReducer';
import MessageReducer from './main/MessageReducer';
import CurrentUserReducer from './main/CurrentUserReducer';
import UserReducer from './main/UserReducer';

const messagePersistConfig = {
    key: 'message',
    storage: AsyncStorage
}

const dialogPersistConfig = {
    key: 'dialog',
    storage: AsyncStorage
}
export default combineReducers({
    LoginReducer,
    MessageReducer:persistReducer(messagePersistConfig, MessageReducer),
    DialogReducer:persistReducer(dialogPersistConfig, DialogReducer),
    CurrentUserReducer,
    UserReducer

})
