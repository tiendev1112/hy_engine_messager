import {combineReducers} from 'redux';
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';

import localStorageKey from '../util/LocalStorageKey';
import {getItemObject} from '../util/LocalStorage';
import {reducer as formReducer} from 'redux-form';
import LoginReducer from './login/LoginReducer';
import DialogReducer from './main/DialogReducer';
import MessageReducer from './main/MessageReducer';
import CurrentUserReducer from './main/CurrentUserReducer';
import UserReducer from './main/UserReducer';
import ChatMediaReducer from './main/ChatMediaReducer';


const messagePersistConfig = {
    key: 'message',
    storage: AsyncStorage
}

const dialogPersistConfig = {
    key: 'dialog',
    storage: AsyncStorage
}
export default combineReducers({
    form: formReducer,
    LoginReducer,
    MessageReducer:persistReducer(messagePersistConfig, MessageReducer),
    DialogReducer:persistReducer(dialogPersistConfig, DialogReducer),
    CurrentUserReducer,
    UserReducer,
    ChatMediaReducer

})
