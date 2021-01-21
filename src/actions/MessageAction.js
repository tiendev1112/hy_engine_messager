export const FETCH_MESSAGES = 'FETCH_MESSAGES'
export const PUSH_MESSAGE = 'PUSH_MESSAGE'
export const DELETE_DIALOG_MESSAGES = 'DELETE_DIALOG_MESSAGES'
export const LAZY_FETCH_MESSAGES = 'LAZY_FETCH_MESSAGES'
export const UPDATE_MESSAGES = 'UPDATE_MESSAGES'
export const CLEAR_MESSAGES = 'CLEAR_MESSAGES'

export const fetchMessages = (dialogId, history) => ({ type: FETCH_MESSAGES, dialogId, history })
export const lazyFetchMessages = (dialogId, history) => ({ type: LAZY_FETCH_MESSAGES, dialogId, history })
export const updateMessages = (dialogId, msgId, msg) => ({ type: UPDATE_MESSAGES, dialogId, msgId, msg })
export const pushMessage = (message, dialogId) => ({ type: PUSH_MESSAGE, message, dialogId })
export const deleteDialogMessages = dialogId => ({ type: DELETE_DIALOG_MESSAGES, dialogId })
export const clearMessage = () => ({ type: CLEAR_MESSAGES })