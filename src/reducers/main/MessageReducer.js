import {handleActions} from 'redux-actions';
import {
  PUSH_MESSAGE,
  FETCH_MESSAGES,
  DELETE_ALL_MESSAGES,
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
        [PUSH_MESSAGE]: (state, action) => {
            const {message} = action;
            console.log(message);
            const copyMessages = state.messages[message.dialogId] || [] ;
            console.log("copyMessage",copyMessages);
            //state.messages = {...state.messages,[message.dialogId]: [message, ...copyMessages]};

            return {...state,messages:{...state.messages,[message.dialogId]: [message, ...copyMessages]}};
        }
    }, initialState)
