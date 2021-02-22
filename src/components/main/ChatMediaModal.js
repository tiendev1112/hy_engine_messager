import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Dimensions,StyleSheet,View} from 'react-native';
import {Button,Text,Thumbnail} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
const stanzaService = require('../../service');
registerGlobals();
const {height,width} = Dimensions.get('window');
console.log(height,width);
const configuration = {"iceServers": [{"urls": "stun:139.196.59.138:3478?transport=udp"},{"urls": "turn:139.196.59.138:3478?transport=udp"}]};


class ChatMediaModal extends Component {
    constructor(props) {
        super(props);
        this.state={
            localStream:null,
            remoteStream:null,
            isIncoming :false,
            isAudio : false,
            isLoudSpeaker : false,
            isCameraFront : true,
            isMute : false,
            status:1
        }
    }

    componentDidMount() {
        const {route} = this.props;
        console.log(route.params.isIncoming);
        console.log(stanzaService.client.xmppClient)
        if(route.params.isIncoming){
            mediaDevices.enumerateDevices().then(sourceInfos => {
                let videoSourceId;
                for (let i = 0; i < sourceInfos.length; i++) {
                    const sourceInfo = sourceInfos[i];
                    if(sourceInfo.kind == "videoinput" && sourceInfo.facing == ("front")) {
                        videoSourceId = sourceInfo.deviceId;
                    }
                }
                mediaDevices.getUserMedia({
                    audio: true,
                    video: {
                        width: width,
                        height: height,
                        frameRate: 30,
                        facingMode: ("user"),
                        deviceId: videoSourceId
                    }
                }).then(stream => {
                    console.log(stream);
                    console.log(stanzaService.client.xmppClient.jingle.sessions);

                    this.setState({localStream:stream});
                    //this.setState({remoteStream:stanzaService.client.xmppClient.jingle.sessions[route.params.sid].streams[0]});
                    /*for (const track of stream.getTracks()) {
                        stanzaService.client.xmppClient.jingle.sessions[route.params.sid].addTrack(track, stream);
                    }*/
                    console.log(route.params);
                    stanzaService.client.xmppClient.jingle.sessions[route.params.sid].accept();
                }).catch(error => {
                    console.log(error);
                });
            });
        }else{
            const jid = route.params.dialog.dialogId+"@"+xmppConfig.host+"/mobile";
            console.log(stanzaService.client.xmppClient);
            const mediaSession = stanzaService.client.xmppClient.jingle.createMediaSession(jid);
            mediaDevices.enumerateDevices().then(sourceInfos => {
                console.log(sourceInfos);
                let videoSourceId;
                for (let i = 0; i < sourceInfos.length; i++) {
                    const sourceInfo = sourceInfos[i];
                    if(sourceInfo.kind == "videoinput" && sourceInfo.facing == ("front")) {
                        videoSourceId = sourceInfo.deviceId;
                    }
                }
                mediaDevices.getUserMedia({
                    audio: true,
                    video: {
                        width: width,
                        height: height,
                        frameRate: 30,
                        facingMode: ("user"),
                        deviceId: videoSourceId
                    }
                }).then(stream => {
                    this.setState({localStream:stream})
                    for (const track of this.state.localStream.getTracks()) {
                        mediaSession.addTrack(track, this.state.localStream);
                    }
                    mediaSession.parent.on('peerTrackAdded',(session, track, stream)=>{
                        console.log('peerTrackAdded',session);
                        console.log('peerTrackAdded',track);
                        console.log('peerTrackAdded',stream);
                    })
                    mediaSession.start();
                    console.log(stanzaService.client.xmppClient.jingle);
                }).catch(error => {
                    console.log(error);
                });
            });
        　}
    }
    hangOff(){

    }

    render() {
        const {navigation,route,messageReducer,dialogReducer,chatMediaReducer,
            hangOffSession} = this.props;
        const isIncoming = route.params.isIncoming || false;
        let renderUserView;
        let renderButtonView;
        let hangOffButton = (
            <View style={styles.circleIcon}>
                <Icon onPress={() => {hangOffSession();navigation.goBack()}}
                      type="MaterialCommunityIcons" name="cancel" size={40}
                      color="red"/>
                <Text style={{color:"white"}}>挂断</Text>
            </View>
        )
        let acceptButton = (
            <View style={styles.circleIcon}>
                <Icon onPress={() =>  navigation.goBack()}
                      type="MaterialCommunityIcons" name="check" size={40}
                      color="green"/>
                <Text style={{color:"white"}}>接听</Text>
            </View>
        )
        let audioVideoToggleButton =this.state.isAudio?(
            <View style={styles.circleIcon}>
                <Icon type="MaterialCommunityIcons" name="video" size={40}
                    onPress={()=>this.setState({isAudio:false})}
                    color="red"/>
                <Text style={{color:"white"}}>视频</Text>
            </View>):(
            <View style={styles.circleIcon}>
                <Icon type="MaterialCommunityIcons" name="microphone" size={40}
                      onPress={()=>this.setState({isAudio:true})}
                      color="red"/>
                <Text style={{color:"white"}}>语音</Text>
            </View>);
        let muteToggleButton =(
            <View style={[styles.circleIcon,{backgroundColor:this.state.isMute?"white":"transparent"}]}>
                <Icon type="MaterialCommunityIcons" name="volume-mute" size={40}
                      onPress={()=>this.setState({isMute:!this.state.isMute})}
                      color="green"/>
                <Text style={{color:"green"}}>静音</Text>
            </View>)
        let louderSpeakerToggleButton = (
            <View style={[styles.circleIcon,{backgroundColor:this.state.isLoudSpeaker?"white":"transparent"}]}>
                <Icon type="MaterialCommunityIcons" name="volume-high" size={40}
                      onPress={()=>this.setState({isLoudSpeaker:!this.state.isLoudSpeaker})}
                      color="red"/>
                <Text style={{color:"red"}}>免提</Text>
            </View>)

        if(this.state.status==1) {//状态为未接通
            renderUserView = (
                <View style={{flex:1,alignItems:"center",paddingTop:0}}>
                    <Thumbnail style={{width:120,height:120,borderRadius:60}} source={{ uri: 'https://s.gravatar.com/avatar/49f4297846f70d6c070b0b604dd99175?size=100&default=retro' }} />
                    <Text style={{color:"white",paddingTop:10,fontSize:24}}>euser2</Text>
                </View>);
            if(isIncoming){//被叫
                renderButtonView = (
                    <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
                        <View style={styles.circleIcon}>
                            <Icon onPress={() => {hangOffSession();navigation.goBack()}}
                                  type="MaterialCommunityIcons" name="phone-off-outline" size={40}
                                  color="red"/>
                            <Text style={{color:"white"}}>拒接</Text>
                        </View>
                        {acceptButton}
                    </View>
                );
            }else {//主叫
                console.log("主叫")
                if(this.state.isAudio){//语音通话
                    renderButtonView = (
                        <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
                            {muteToggleButton}
                            {acceptButton}
                            {louderSpeakerToggleButton}
                        </View>
                    );
                }else{//视频通话
                    renderButtonView = (
                        <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
                            {audioVideoToggleButton}
                            {hangOffButton}
                            {/*<View style={[styles.circleIcon,{backgroundColor:!this.state.isCameraFront?"white":"transparent"}]}>
                                <Icon onPress={() =>  this.setState({isCameraFront:!this.state.isCameraFront})}
                                      type="MaterialCommunityIcons" name="video-switch" size={40}
                                      color="red"/>
                                <Text style={{color:"red"}}>镜头</Text>
                            </View>*/}
                        </View>
                    )
                }
            }
        }else{
            //状态为接通
            renderUserView = (
                <View></View>
            )
            renderButtonView = (
                <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
                    {hangOffButton}
                </View>
            );
        }



        console.log(renderButtonView);

        return (
            <View style={styles.wrapper}>

                <View  style={styles.back}>
                    {this.state.localStream== null ? null :(<RTCView style={{backgroundColor:"black",width:width,height:height/2}} mirror={true} streamURL={this.state.localStream.toURL()}/>)}
                </View>
                <View style={styles.front}>
                    <View style={{flex:1,flexDirection:"row",justifyContent:"center",alignItems:"center",backgroundColor:"transparent"}}>
                        {/*{renderUserView}*/}
                    </View>
                    <View style={{flex:1,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                        {renderButtonView}
                    </View>
                </View>
            </View>
        )
    }
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
        zIndex: 1
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
