import {handleActions} from 'redux-actions';
import {
  PUSH_MESSAGE,
  FETCH_MESSAGES,
  CLEAR_MESSAGES,
  LAZY_FETCH_MESSAGES,
  UPDATE_MESSAGES
} from '../../actions/MessageAction'

import { lazyFetchMessages, updateStatusMessages } from '../ReducerUtil'


const initialState = {
    messages:{}
};

export default handleActions(
    {

        [UPDATE_MESSAGES]: (state, action) => {
            const mergedUpdatedMessages = updateStatusMessages(action, messages)
            return mergedUpdatedMessages;
        },
        [CLEAR_MESSAGES]: (state, action) => {
            console.log("clear message")
            return {...state,messages:{}};
        },
        [PUSH_MESSAGE]: (state, action) => {
            const {message} = action;
            const copyMessages = state.messages[message.dialogId] || [] ;
            //state.messages = {...state.messages,[message.dialogId]: [message, ...copyMessages]};

            return {...state,messages:{...state.messages,[message.dialogId]: [message, ...copyMessages]}};
        }
    }, initialState)
