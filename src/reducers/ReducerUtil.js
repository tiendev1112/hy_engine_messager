import Dialog from '../models/Dialog';
const createDialogByMessage = (action)=>{
    const { dialog, count } = action;
    const newObj = {
        name : 'user4',
        photo: 'http://erp.stsswl.com/assets/images/logo_72.png',
        userId : dialog.userId,
        lastMessage: dialog.body,
        lastMessageId: dialog.id,
        lastMessageDateSent: dialog.dateSent || Date.now()/1000,
        createdAt: dialog.dateSent||Date.now()/1000,
        unreadMessagesCount: count ||1,
        unreadMessagesIds : dialog.id ? [dialog.id]:[]
    }
    return new Dialog(newObj);
}
const updateDialog = (action, dialogs) => {
  const alreadyUpdatedDialog = dialogs.map(elem => {
    if (elem.userId === action.dialog.userId) {
      return Object.assign(elem, action.dialog)
    } return elem
  })
  return [...alreadyUpdatedDialog]
}

const updateDialogUnread = (actions,dialogs)=>{
    const dialogIndex =dialogs.findIndex(elem => elem.dialogId==actions.dialog.dialogId);
    if(dialogIndex>=0){
        const newObj = {
            unreadMessagesCount:  0,
            unreadMessagesIds :[]
        }
        const dialogItem = Object.assign(dialogs[dialogIndex], newObj)
        dialogs.splice(dialogIndex,1);
        return [dialogItem,...dialogs];
    }
}

const lazyFetchMessages = (action, messages) => {
  const mergeMessages = messages[action.dialogId].concat(action.history)
  return { ...{}, [action.dialogId]: mergeMessages }
}

const sortedDialog = (action, dialogs) => {
    const { message,count } = action;
    console.log(message);
    const dialogIndex =dialogs.findIndex(elem => elem.dialogId==message.dialogId);
    if(dialogIndex>=0){
        const newObj = {
            lastMessage: message.text,
            lastMessageDateSent: message.createdAt,
            createdAt: message.createdAt,
            unreadMessagesCount:  count ?dialogs[dialogIndex].unreadMessagesCount+1:dialogs[dialogIndex].unreadMessagesCount
        }
        const dialogItem = Object.assign(dialogs[dialogIndex], newObj)
        dialogs.splice(dialogIndex,1);
        return [dialogItem,...dialogs];
    }else{
        const newDialogObj = {
            name : message.user.name,
            photo: message.user.avatar,
            dialogId : message.dialogId,
            lastMessage: message.text,
            lastMessageId: message._id,
            lastMessageDateSent: message.createdAt || Date.now(),
            createdAt: message.createdAt||Date.now(),
            unreadMessagesCount: 1,
            unreadMessagesIds : message._id ? [message._id]:[]
        }
        return [new Dialog(newDialogObj),...dialogs];
    }
}

const updateStatusMessages = (action, message) => {
  if (Object.keys(message).length == 0) {
    return message
  }

  let isBreak = true
  const newMessages = message[action.dialogId].map((elem, index) => {
    if (elem.id === action.msgId) {
      isBreak = false
      return Object.assign(elem, action.msg)
    } else if (isBreak) {
      return Object.assign(elem, action.msg)
    }
    return elem
  })

  const result = { ...message, [action.dialogId]: newMessages }

  return result
}

const fetchUsers = (action, users) => {
  const newObjUsers = {}
  action.forEach(elem => {
    newObjUsers[elem._id] = elem
  })
  return { ...users, ...newObjUsers }
}

const updateUser = (action, users) => {

    const result = { ...users, [action.user._id]: action.user }

    return result
}
export {
    createDialogByMessage,
    updateDialog,
    updateDialogUnread,
    lazyFetchMessages,
    sortedDialog,
    updateStatusMessages,
    fetchUsers,
    updateUser
}