export const STATUS_PENDING = 0
export const STATUS_SENT = 1
export const STATUS_DELIVERED = 2
export const STATUS_READ = 3

const defaultMessage = {
    _id: '',
	dialogId: '',
    text: '',
    createdAt: Date.now(),
    user: {},
    image: '',
    video: '',
    audio: '',
    system: false,
    sent: false,
    received: false,
    pending: false,
    quickReplies: {}
}

export class Message {
	constructor(msg = defaultMessage) {
		this._id = msg._id;
		this.dialogId = msg.dialogId;
		this.user = msg.user;
		this.createdAt = msg.createdAt|| Date.now()
		this.text = msg.text;
		this.image = msg.image;
		this.video = msg.video;
		this.audio = msg.audio;
		this.system = msg.system;
		this.sent = msg.sent;
		this.received = msg.received;
		this.pending = msg.pending;
		this.quickReplies = msg.quickReplies;
	}

}
