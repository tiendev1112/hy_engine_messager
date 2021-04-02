import * as XMPP from 'stanza';
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices,
    registerGlobals
} from 'react-native-webrtc';

import {sortDialogs} from '../actions/DialogAction';
import {pushMessage} from "../actions/MessageAction";
import {setMediaSession,setIncomingFlag,setStatus} from "../actions/ChatMediaAction";
import {setCurrentUser} from "../actions/CurrentUserActions";
import {getIdFromResource,getUserIdFromResource,getUserIdFromJID} from "../service/StanzaUtil";
import * as stanzaConst from './StanzaConst';
import {Message} from '../models/Message';
import {store} from '../store'

import {xmppConfig} from "../config";


class StanzaService {
    constructor(username,password,navigator) {
        console.log(xmppConfig);
        this.xmppClient = XMPP.createClient({
            transports:xmppConfig.transports,
            resource: xmppConfig.resource,
            jid: username+"@"+xmppConfig.host,
            password: password,
            allowResumption: false
        });
        this.pc = null;
        this.isConnected = false;
        this.isLogout = false;
    }
    init(navigation) {
        return new Promise((resolve, reject) => {
            if (this.isConnected) {
                console.log('XMPP has been connected');
                return;
            }
            this.xmppClient.navigation = navigation;
            //console.log(this);
            this.xmppClient.on('connected', this.connectListener);
            this.xmppClient.on('disconnected', this.disconnectListener);
            this.xmppClient.on('session:started', this.sessionStartListener);
            this.xmppClient.on('presence', this.presenceListener);
            this.xmppClient.on('iq', this.iqListener);
            this.xmppClient.on('iq:get:disco', this.iqDiscoListener);
            this.xmppClient.on('groupchat', this.groupchatListener);
            this.xmppClient.on('chat', this.chatListener);
            this.xmppClient.on('message', this.messageListener);
            this.xmppClient.on('message:sent', this.messageSentListener);

            this.xmppClient.on('jingle:incoming', this.jingleIncomingListener);
            this.xmppClient.on('jingle:ringing', this.jingleRingListener);
            this.xmppClient.on('jingle:outgoing', this.jingleOutgoListener);
            this.xmppClient.on('jingle:terminated', this.jingleTerminatedListener);
            this.xmppClient.on('iq:set:jingle', (data)=>{
                console.log('iq:set:jingle',data);
            });
            this.xmppClient.on('jingle:created', (session)=>{
                console.log('jingle:created', session);
            });

            /*this.xmppClient.jingle.on('peerTrackAdded', function (session, track, stream) {
                console.log('peerTrackAdded',session);
                console.log('peerTrackAdded',track);
                console.log('peerTrackAdded',stream);
            });*/
            this.xmppClient.jingle.on('log', console.log);
            this.xmppClient.on('raw:outgoing', function (data) {
                console.log("out>>",data.toString());
            });

        });

    }
    connectListener(msg){
        console.log('XMPP Client is online ',msg);
        console.log(this);
        this.isConnected =true;
    }
    sessionStartListener(){
        this.sendPresence();
        this.jingle.resetICEServers();
        this.discoverICEServers();
        console.log(this);
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
        let msgObj = new Message({
            dialogId:getUserIdFromResource(msg.from),
            _id : msg.id,
            createdAt:msg.delay?new Date(msg.delay.timestamp).getTime():Date.now() ,
            user:{_id:getUserIdFromResource(msg.from),name:getUserIdFromResource(msg.from),avatar:'http://erp.stsswl.com/assets/images/logo_72.png'}
        });
        let msgBodyObj ;
        try{
            msgBodyObj =JSON.parse(msg.body)
        }catch (e){
            msgBodyObj={
                type :stanzaConst.MSG_TYPE_TEXT,
                text : msg.body
            }
        }
        console.log(msgObj);
        if(msgBodyObj.type == stanzaConst.MSG_TYPE_TEXT){
            msgObj = {...msgObj,text:msgBodyObj.text}
            console.log(msgObj);
            store.dispatch(pushMessage(msgObj));
            store.dispatch(sortDialogs(msgObj,1));
        }
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
        console.log(msg);
        let msgBodyObj ;
        try{
            msgBodyObj =JSON.parse(msg.body)
        }catch (e){
            msgBodyObj={
                type :stanzaConst.MSG_TYPE_TEXT,
                text : msg.body
            }
        }
        let msgObj = new Message({
            dialogId:getUserIdFromResource(msg.from),
            _id : msg.id,
            createdAt:msg.delay?new Date(msg.delay.timestamp).getTime():Date.now() ,
            user:{_id:getUserIdFromResource(msg.from),name:getUserIdFromResource(msg.from),avatar:'http://erp.stsswl.com/assets/images/logo_72.png'}
        });
        console.log(this);
        if(msgBodyObj.type == stanzaConst.MSG_TYPE_TEXT){
            msgObj = {...msgObj,text:msgBodyObj.text}
            console.log(msgObj);
            store.dispatch(pushMessage(msgObj));
            store.dispatch(sortDialogs(msgObj,1));
        }else if(msgBodyObj.type == stanzaConst.MSG_TYPE_MEDIA_ANSWER){
            console.log("---->set remote description ",new RTCSessionDescription(msgBodyObj.text))
            this.pc.setRemoteDescription(new RTCSessionDescription(msgBodyObj.text));
            store.dispatch(setStatus(2));
        }else if(msgBodyObj.type == stanzaConst.MSG_TYPE_MEDIA_CANDIDATE){
            console.log("---->add ice candidate",msgBodyObj);
            if(this.pc != null){
                this.pc.addIceCandidate(new RTCIceCandidate(msgBodyObj.text)).then(res=>{console.log("add ice candidate success",res)}).catch(e=>{console.log("add candidate error ")});
            }
        }else if(msgBodyObj.type == stanzaConst.MSG_TYPE_MEDIA_AUDIO_OFFER || msgBodyObj.type == stanzaConst.MSG_TYPE_MEDIA_VIDEO_OFFER){

            if(this.pc == null && !msg.delay){
                this.navigation.navigate('chatMediaModal',{dialog:{dialogId:getUserIdFromResource(msg.from)},isIncoming:true,offer:msgBodyObj.text,offerType:msgBodyObj.type})
            }else{
                msgObj = {...msgObj,text:"未接通话",system:true}
                store.dispatch(pushMessage(msgObj));
                store.dispatch(sortDialogs(msgObj,1));
            }
        }else if(msgBodyObj.type == stanzaConst.MSG_TYPE_MEDIA_LEAVE){
            console.log("----> level");
            msgObj = {...msgObj,text:"结束通话",system:true}
            store.dispatch(pushMessage(msgObj));
            store.dispatch(sortDialogs(msgObj,1));
            this.pc.onicecandidate = null;
            this.pc.ontrack = null;
            this.pc = null;
            this.navigation.goBack();
        }
    }
    jingleIncomingListener(session) {
        console.log("jingle incoming");
        console.log(session.parent.sessions);
        store.dispatch(setIncomingFlag(true));
        store.dispatch(setMediaSession(session.parent.sessions[0]));
        this.navigation.navigate('chatMediaModal',{dialog:"user2",sid:session.sid,isIncoming:true})
    }
    jingleOutgoListener(session){
        console.log("jingle outgoing");
        store.dispatch(setMediaSession(session));
    }
    jingleTerminatedListener(session,track,stream){
        console.log("jingle terminated");
    }
    jingleRingListener(session,track,stream){
        console.log("jingle ringing");
    }
    messageSentListener(msg){
        console.log("Message Sent>> ")
        if(msg.receipt){
            //自动回复收到信息
        }else{
            //计入reducer
            let msgObj = new Message({
                dialogId:getUserIdFromJID(msg.to),
                _id : msg.id,
                createdAt:Date.now(),
                user:store.getState().CurrentUserReducer.user
            });
            let msgBodyObj ;
            try{
                msgBodyObj =JSON.parse(msg.body)
            }catch (e){
                msgBodyObj={
                    type :stanzaConst.MSG_TYPE_TEXT,
                    text : msg.body
                }
            }
            console.log(msgObj);
            if(msgBodyObj.type == stanzaConst.MSG_TYPE_TEXT){
                msgObj = {...msgObj,text:msgBodyObj.text}
                console.log(msgObj);
                store.dispatch(pushMessage(msgObj));
                store.dispatch(sortDialogs(msgObj));
            }
            /*const msgObj = new Message({
                dialogId:getUserIdFromJID(msg.to),
                _id : msg.id,
                text:msg.body,
                user:store.getState().CurrentUserReducer.user,
                createdAt:Date.now()
            });
            console.log(msgObj);
            store.dispatch(pushMessage(msgObj));
            store.dispatch(sortDialogs(msgObj));*/
        }
    }

}

module.exports = StanzaService;