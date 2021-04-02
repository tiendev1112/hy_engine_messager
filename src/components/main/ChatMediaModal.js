import React,{useEffect, useState, useRef} from 'react';
import {connect} from 'react-redux';
import {Dimensions,StyleSheet,TouchableOpacity,View} from 'react-native';
import {Button,Text,Thumbnail} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import InCallManager from 'react-native-incall-manager';
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

import {xmppConfig} from "../../config";
import * as chatMediaAction from "../../actions/ChatMediaAction";
import * as stanzaConst from '../../service/StanzaConst';
const stanzaService = require('../../service');
registerGlobals();
const {height,width} = Dimensions.get('window');
const configuration = {"iceServers": xmppConfig.iceServers};

function ChatMediaModal(props) {
    const DISCONNECT_STATUS =1 ;
    const CONNECTING_STATUS =2;
    const CONNECTED_STATUS =3;
    const {navigation,route,messageReducer,dialogReducer,chatMediaReducer,
        hangOffSession} = props;
    const isIncoming = route.params.isIncoming || false;
    const mediaType = route.params.offerType;
    const jid = route.params.dialog.dialogId+"@"+xmppConfig.host+"/mobile";

    const bigView = useRef();
    const smallView = useRef();
    const [timerCount,setTimerCount] = useState(0);
    const timerRef = useRef();
    const [localStream, setLocalStream] = useState({toURL: () => null});
    const [remoteStream, setRemoteStream] = useState({toURL: () => null});
    const [isLocalBig,setIsLocalBig] = useState(true);
    const [isAudio,setIsAudio] = useState(() => {return mediaType==stanzaConst.MSG_TYPE_MEDIA_AUDIO_OFFER?true:false });
    const [isLoudSpeaker,setIsLoudSpeaker] = useState(()=>{return mediaType==stanzaConst.MSG_TYPE_MEDIA_AUDIO_OFFER?false:true});

    const [isCameraFront,setIsCameraFront] = useState(true);
    const [isMute,setIsMute] = useState(false);
    const [status,setStatus] = useState(DISCONNECT_STATUS);





    useEffect(() => {

        stanzaService.client.xmppClient.pc = new RTCPeerConnection({
            iceServers: [
                {
                    urls: 'stun:139.196.59.138:3478?transport=udp',
                },
            ],
        });

        initLocalVideo();
        registerPeerEvents();
        console.log(new RTCSessionDescription(route.params.offer).toJSON());
        if(route.params.isIncoming){

        }else {
            setTimeout(() => {
                stanzaService.client.xmppClient.pc.createOffer().then(offer => {
                    stanzaService.client.xmppClient.pc.setLocalDescription(offer).then(() => {
                        const msgObj = {
                            type: isAudio?stanzaConst.MSG_TYPE_MEDIA_AUDIO_OFFER:stanzaConst.MSG_TYPE_MEDIA_VIDEO_OFFER,
                            text: offer
                        }
                        console.log(offer);
                        stanzaService.client.xmppClient.sendMessage({to: jid, body: JSON.stringify(msgObj)});
                    });
                });
            }, 4000);
        }

    }, []);

    //通话计时
    const timerStart  = ()=>{
        console.log("timer start");

    };
    const timerStop = ()=>{
        return () => {clearInterval(timerRef.current)};
    }
    const registerPeerEvents = () => {
        stanzaService.client.xmppClient.pc.onaddstream = event => {
            console.log('--->On Add Remote Stream');
            setRemoteStream(event.stream);
            if(isLoudSpeaker){
                InCallManager.setSpeakerphoneOn(true);
            }
            setStatus(CONNECTED_STATUS);
            switchView();
        };
        stanzaService.client.xmppClient.pc.oniceconnectionstatechange = state => {
            console.log('oniceconnectionstatechange:',state);
        };
        stanzaService.client.xmppClient.pc.onconnectionstatechange = state => {
            console.log('onconnectionstatechange:',state);
        };
        stanzaService.client.xmppClient.pc.onconnectionstatechange = state => {
            console.log('onconnectionstatechange:',state);
        };
        stanzaService.client.xmppClient.pc.onicecandidate = event => {
            console.log('---> send candidate');
            if (event.candidate) {
                const msgObj ={
                    type:stanzaConst.MSG_TYPE_MEDIA_CANDIDATE,
                    text:event.candidate
                }
                stanzaService.client.xmppClient.sendMessage({to:jid,body:JSON.stringify(msgObj)});
            }
        };

    }
    const initLocalVideo = () => {
        let deviceOptions ;
        console.log(isAudio,isLoudSpeaker)
        if(isAudio){
            console.log("init audio media")
            deviceOptions={
                audio: true
            }
        }else{
            console.log("init video media")
            deviceOptions={
                audio: true,
                video: {
                    audio: true,
                    video: {
                        width: width,
                        height: height,
                        frameRate: 30,
                        facingMode: ("user")
                    }
                }
            }
        }
        mediaDevices.getUserMedia(deviceOptions).then(stream => {
            setLocalStream(stream);
            stanzaService.client.xmppClient.pc.addStream(stream);
            console.log(stanzaService.client.xmppClient.pc.getLocalStreams());

        }).catch(error => {

        });



    };

    const accept = async () => {


        stanzaService.client.xmppClient.pc.setRemoteDescription(new RTCSessionDescription(route.params.offer)).then(()=>{
            return stanzaService.client.xmppClient.pc.createAnswer();
        }).then((answer)=>{
            stanzaService.client.xmppClient.pc.setLocalDescription(answer);
            const msgObj ={
                type:stanzaConst.MSG_TYPE_MEDIA_ANSWER,
                text:answer
            }
            console.log(answer);
            stanzaService.client.xmppClient.sendMessage({to:jid,body:JSON.stringify(msgObj)});
        })
    }
    const leave = () => {
        const msgObj ={
            type:stanzaConst.MSG_TYPE_MEDIA_LEAVE
        }
        if(status == CONNECTED_STATUS){
            stanzaService.client.xmppClient.sendMessage({to:jid,body:JSON.stringify(msgObj)});
        }
        setRemoteStream(null);
        setLocalStream(null);
        stanzaService.client.xmppClient.pc.close();
        stanzaService.client.xmppClient.pc.onicecandidate = null;
        stanzaService.client.xmppClient.pc.ontrack = null;
        stanzaService.client.xmppClient.pc = null;

        navigation.goBack()


    }

    const toggleMute = () => {
        const localAudioTracks = localStream.getAudioTracks();
        if(isMute){
            localAudioTracks.forEach(t => stanzaService.client.xmppClient.pc.getLocalStreams()[0].addTrack(t));
            setIsMute(false);
        }else{
            localAudioTracks.forEach(t => stanzaService.client.xmppClient.pc.getLocalStreams()[0].removeTrack(t));
            setIsMute(true);
        }

    }

    const toggleSpeaker =() =>{
        if(isLoudSpeaker){
            InCallManager.setSpeakerphoneOn(false);
        }else{
            InCallManager.setSpeakerphoneOn(true);
        }
        setIsLoudSpeaker(!isLoudSpeaker);
    }
    const toggleAudio = ()=>{
        const localVideoTracks = localStream.getVideoTracks();
        localVideoTracks.forEach(t => stanzaService.client.xmppClient.pc.getLocalStreams()[0].removeTrack(t));
        setIsAudio(true);
    }

    const switchCamera = ()=>{
        stanzaService.client.xmppClient.pc.getLocalStreams()[0].getVideoTracks().forEach((track) => {
            track._switchCamera()
        })
        setIsCameraFront(!isCameraFront);
    }
    const switchView =() =>{
        if(isLocalBig){
            setLocalStream(stanzaService.client.xmppClient.pc.getRemoteStreams()[0]);
            setRemoteStream(stanzaService.client.xmppClient.pc.getLocalStreams()[0]);
        }else{
            setLocalStream(stanzaService.client.xmppClient.pc.getLocalStreams()[0]);
            setRemoteStream(stanzaService.client.xmppClient.pc.getRemoteStreams()[0]);
        }
        setIsLocalBig(!isLocalBig);

    }
    const formatTime = (count) =>{
        const s = count % 60;
        const m = parseInt(count / 60) % 60;
        const h = parseInt(count / 60 / 60);
        clearInterval(timerRef.current);
        return h.toString().padStart(2,'0')+":"+m.toString().padStart(2,'0')+":"+s.toString().padStart(2,'0');
    }


    let renderUserView;
    let renderButtonView;
    let hangOffButton = (
        <View style={styles.circleIcon}>
            <Icon onPress={leave}
                  type="MaterialCommunityIcons" name="cancel" size={40}
                  color="red"/>
            <Text style={{color:"white"}}>挂断</Text>
        </View>
    );
    let acceptButton = (
        <View style={styles.circleIcon}>
            <Icon onPress={accept}
                  type="MaterialCommunityIcons" name="check" size={40}
                  color="green"/>
            <Text style={{color:"white"}}>接听</Text>
        </View>
    );
    let audioToggleButton =(
        <View style={styles.circleIcon}>
            <Icon type="MaterialCommunityIcons" name="microphone" size={40}
                  onPress={toggleAudio}
                  color="red"/>
            <Text style={{color:"white"}}>语音</Text>
        </View>);
    let muteToggleButton =(
        <View style={[styles.circleIcon,{backgroundColor:isMute?"white":"transparent"}]}>
            <Icon type="MaterialCommunityIcons" name="volume-mute" size={40}
                  onPress={toggleMute}
                  color="green"/>
            <Text style={{color:"green"}}>静音</Text>
        </View>)
    let louderSpeakerToggleButton = (
        <View style={[styles.circleIcon,{backgroundColor:isLoudSpeaker?"white":"transparent"}]}>
            <Icon type="MaterialCommunityIcons" name="volume-high" size={40}
                  onPress={toggleSpeaker}
                  color="red"/>
            <Text style={{color:"red"}}>免提</Text>
        </View>)

    if(status==DISCONNECT_STATUS) {//状态为未接通
        renderUserView = (
            <View style={{flex:1,alignItems:"center",paddingTop:0}}>
                <Thumbnail style={{width:120,height:120,borderRadius:60}} source={{ uri: 'https://s.gravatar.com/avatar/49f4297846f70d6c070b0b604dd99175?size=100&default=retro' }} />
                <Text style={{color:"white",paddingTop:10,fontSize:24}}>{timerCount}</Text>
            </View>);

        if(isIncoming){//被叫
            renderButtonView = (
                <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
                    <View style={styles.circleIcon}>
                        <Icon onPress={leave}
                              type="MaterialCommunityIcons" name="phone-off-outline" size={40}
                              color="red"/>
                        <Text style={{color:"white"}}>拒接</Text>
                    </View>
                    {acceptButton}
                </View>
            );
        }else {//主叫
            if(isAudio){//语音通话
                renderButtonView = (
                    <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
                        {hangOffButton}
                        {louderSpeakerToggleButton}
                    </View>
                );
            }else{//视频通话
                renderButtonView = (
                    <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
                        {audioToggleButton}
                        {hangOffButton}
                        <View style={[styles.circleIcon,{backgroundColor:!isCameraFront?"white":"transparent"}]}>
                            <Icon onPress={switchCamera}
                                  type="MaterialCommunityIcons" name="video-switch" size={40}
                                  color="red"/>
                            <Text style={{color:"red"}}>镜头</Text>
                        </View>
                    </View>
                )

            }
        }

    }else{
        //状态为接通
        if(isAudio){
            renderButtonView = (
                <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
                    {hangOffButton}
                    {muteToggleButton}
                    {louderSpeakerToggleButton}
                </View>
            );
        }else{
            renderButtonView = (
                <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
                    {audioToggleButton}
                    {hangOffButton}
                    <View style={[styles.circleIcon,{backgroundColor:!isCameraFront?"white":"transparent"}]}>
                        <Icon onPress={switchCamera}
                              type="MaterialCommunityIcons" name="video-switch" size={40}
                              color="red"/>
                        <Text style={{color:"red"}}>镜头</Text>
                    </View>
                </View>
            )
        }
        renderUserView = (
            <TouchableOpacity ref={smallView} onPress={switchView} style={{alignItems:"flex-start",backgroundColor:"transparent",width:width/3,height:height/3}}>
                <RTCView style={{backgroundColor:"transparent",width:width/3,height:height/3,}} mirror={true} streamURL={remoteStream ? remoteStream.toURL() : ''}/>
            </TouchableOpacity>
        )


    }
    return (
        <View style={styles.wrapper}>

            <TouchableOpacity ref={bigView} style={styles.back}>
                <RTCView style={{width:width,height:height}} mirror={true} streamURL={localStream ? localStream.toURL() :  ''}/>
                <Text>{timerCount}</Text>
            </TouchableOpacity>
            <View style={[styles.front,{backgroundColor:status==DISCONNECT_STATUS?"grey":"transparent"}]}>
                <View  style={{flex:1,flexDirection:"row",justifyContent:status==DISCONNECT_STATUS?"center":"flex-end",backgroundColor:"transparent"}}>
                    {renderUserView}
                </View>
                <View style={{flex:1,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                    {renderButtonView}
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    wrapper: {
        width:width,
        height:height,
        backgroundColor:"black"
    },
    back: {
        width: width,
        height: height,
        zIndex: 0
    },
    front: {
        position: 'absolute',
        width:width,
        height:height,
        zIndex: 10
    },
    circleIcon:{
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        borderWidth:1,
        borderColor:"white",
        width:80,
        height:80,
        borderRadius:40
    },
});
const mapStateToProps = (state) => {
    return {
        messageReducer: state.MessageReducer,
        dialogReducer: state.DialogReducer,
        currentUserReducer:state.CurrentUserReducer,
        chatMediaReducer : state.ChatMediaReducer
    }
}

const mapDispatchProps = (dispatch, props) => ({
    setAudioFlag: (audioFlag) =>{ dispatch(chatMediaAction.setAudioFlag(audioFlag))},
    setMuteFlag: (muteFlag) =>{ dispatch(chatMediaAction.setMuteFlag(muteFlag))},
    setLoudSpeakerFlag: (loudSpeakerFlag) =>{ dispatch(chatMediaAction.setLoudSpeakerFlag(loudSpeakerFlag))},
    setCameraFrontFlag: (cameraFrontFlag) =>{ dispatch(chatMediaAction.setCameraFrontFlag(cameraFrontFlag))},
    hangOffSession :()=>{dispatch(chatMediaAction.hangOffSession())}

})
export default connect(mapStateToProps, mapDispatchProps)(ChatMediaModal)
