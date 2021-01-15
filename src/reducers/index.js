import {combineReducers} from 'redux';


import LoginReducer from './login/LoginReducer';
import DialogReducer from './main/DialogReducer';
import MessageReducer from './main/MessageReducer';
export default combineReducers({
    LoginReducer,DialogReducer,MessageReducer
})
