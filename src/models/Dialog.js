

export default class Dialog {
  constructor(dialog = defaultDialog) {
    this.name = dialog.name;
    this.photo = dialog.photo;
    this.description = dialog.description;
    this.userId = dialog.userId;
    this.dialogId = dialog.dialogId;
    this.createdAt =  Date.now();
    this.lastMessageDateSent = dialog.lastMessageDateSent || dialog.createdAt/1000 ||Date.now()/ 1000
    this.lastMessage = dialog.lastMessage || '' ;
    this.lastMessageId = dialog.lastMessageId ;
    this.unreadMessagesCount = dialog.unreadMessagesCount ;
    this.unreadMessagesIds = dialog.unreadMessagesIds ;
  }

}
