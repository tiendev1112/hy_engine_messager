import {handleActions} from 'redux-actions';
import {
  FETCH_DIALOGS,
  ADD_DIALOG,
  SORT_DIALOGS,
  UPDATE_DIALOG,
  UPDATE_DIALOG_UNREAD,
  DELETE_DIALOG
} from '../../actions/DialogAction';
import { createDialogByMessage,updateDialog,updateDialogUnread, sortedDialog } from '../ReducerUtil'

const initialState = {
    dialogs:[
        {
            name : 'euser2',
            photo: 'http://erp.stsswl.com/assets/images/logo_72.png',
            dialogId : 'euser2',
            lastMessage: 'No message',
            lastMessageId: 'alkj2349jlajjk34',
            lastMessageDateSent: 1605144573228,
            createdAt: 1605144573228,
            unreadMessagesCount: 0,
            unreadMessagesIds : []
        }
    ]
};

export default handleActions(
    {

        [UPDATE_DIALOG]: (state, action) => {
            const result = updateDialog(action,state.dialogs)
            return {
                ...state,
                dialogs: result
            }
        },
        [UPDATE_DIALOG_UNREAD]: (state, action) => {
            const result =updateDialogUnread(action,state.dialogs);
            return {...state,dialogs:result};
        },
        [ADD_DIALOG]: (state, action) => {
            const newDialog = createDialogByMessage(action);
            console.log(state);
            return {
                ...state,
                dialogs: [newDialog,...state.dialogs]
            }
        },
        [SORT_DIALOGS]: (state, action) => {
            const result = sortedDialog(action, state.dialogs)
            return {
                ...state,
                dialogs:result
            }
        },

    }, initialState)

