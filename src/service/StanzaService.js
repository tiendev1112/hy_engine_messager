import * as XMPP from 'stanza';

import {sortDialogs} from '../actions/DialogAction';
import {pushMessage} from "../actions/MessageAction";
import {setCurrentUser} from "../actions/CurrentUserActions";
import {getIdFromResource,getUserIdFromResource,getUserIdFromJID} from "../service/StanzaUtil";
import {Message} from '../models/Message';
import {store} from '../store'

import {xmppConfig} from "../config";


class StanzaService {
    constructor(username,password) {
        console.log(xmppConfig);
        this.xmppClient = XMPP.createClient({
            transports:xmppConfig.transports,
            resource: xmppConfig.resource,
            jid: username+"@"+xmppConfig.host,
            password: password,
            allowResumption: false
        });
        this.isConnected = false;
        this.isLogout = false;
    }
    init() {
        return new Promise((resolve, reject) => {
            if (this.isConnected) {
                console.log('XMPP has been connected');
                return;
            }
            console.log(this);
            this.xmppClient.on('connected', this.connectListener);
            this.xmppClient.on('disconnected', this.disconnectListener);
            this.xmppClient.on('session:started', this.sessionStartListener);
            this.xmppClient.on('presence', this.presenceListener);
            this.xmppClient.on('iq', this.iqListener);
            this.xmppClient.on('iq:get:disco', this.iqDiscoListener);
            this.xmppClient.on('groupchat', this.groupchatListener);
            this.xmppClient.on('message', this.messageListener);
            this.xmppClient.on('message:sent', this.messageSentListener);
            this.xmppClient.on('chat', this.chatListener);
            this.xmppClient.on('jingle:incoming', this.jingleIncomingListener);

        });

    }
    connectListener(msg){
        console.log('XMPP Client is online ',msg);
        store.dispatch(setCurrentUser({
            _id:this.config.jid.split('@')[0],
            name: this.config.jid.split('@')[0],
            avatar: 'http://myxxjs.com/assets/img/logo.png',
        }));
        this.isConnected =true;
    }
    sessionStartListener(){
        this.sendPresence();
        //console.log(navigation)
    }
    disconnectListener(msg){
        console.log('XMPP Client is offline ',msg);

        this.isConnected =false;
    }
    presenceListener(presenceMsg){
        console.log('presence >> ',presenceMsg);
    }

    chatListener(msg){
        console.log("Chat >> ")
        console.log(msg)
        const msgObj = new Message({
            dialogId:getUserIdFromResource(msg.from),
            _id : msg.id,
            text:msg.body,
            createdAt:msg.delay?new Date(msg.delay.timestamp).getTime():Date.now() ,
            user:{_id:getUserIdFromResource(msg.from),name:getUserIdFromResource(msg.from),avatar:'http://erp.stsswl.com/assets/images/logo_72.png'}
        });
        store.dispatch(pushMessage(msgObj));
        store.dispatch(sortDialogs(msgObj,1));
    }
    groupchatListener(msg){
        console.log("GroupChat >> ")
        console.log(msg)
    }
    iqListener(msg){
        console.log("IQ >> ")
        console.log(msg)
    }
    iqDiscoListener(msg){
        console.log("IQ Disco >> ")
        console.log(msg)
    }
    messageListener(msg){
        console.log("Message >> ")
        console.log(msg)
    }
    jingleIncomingListener(session, track, stream) {
        console.log("jingle incoming");
        console.log(session)
    }
    messageSentListener(msg){
        console.log("Message Sent>> ")
        if(msg.receipt){
            //自动回复收到信息
        }else{
            //计入reducer
            console.log(store.getState().CurrentUserReducer.user);
            const msgObj = new Message({
                dialogId:getUserIdFromJID(msg.to),
                _id : msg.id,
                text:msg.body,
                user:store.getState().CurrentUserReducer.user,
                createdAt:Date.now()
            });
            console.log(msgObj);
            store.dispatch(pushMessage(msgObj));
            store.dispatch(sortDialogs(msgObj));
        }
    }

}

module.exports = StanzaService;