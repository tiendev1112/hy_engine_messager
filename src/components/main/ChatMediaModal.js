import React,{useEffect, useState, } from 'react';
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
import * as stanzaConst from '../../service/StanzaConst';
const stanzaService = require('../../service');
registerGlobals();
const {height,width} = Dimensions.get('window');
const configuration = {"iceServers": xmppConfig.iceServers};
let pc = null;

/*class ChatMediaModal extends Component {
    constructor(props) {
        super(props);
        this.state={
            offer:null,
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
        const {route ,chatMediaReducer} = this.props;
        console.log(route.params.isIncoming);

        const jid = route.params.dialog.dialogId+"@"+xmppConfig.host+"/mobile";
        console.log(jid);
        stanzaService.client.xmppClient.pc = new RTCPeerConnection({
            iceServers: [
                {
                    urls: 'stun:139.196.59.138:3478?transport=udp',
                },
            ],
        });

        console.log(stanzaService.client);
        stanzaService.client.xmppClient.pc.onaddstream = event => {
            console.log('On Add Remote Stream');
            this.setState({remoteStream:event.stream});
        };
        stanzaService.client.xmppClient.pc.onicecandidate = event => {
            if (event.candidate) {
                const msgObj ={
                    type:stanzaConst.MSG_TYPE_MEDIA_CANDIDATE,
                    text:event.candidate
                }
                stanzaService.client.xmppClient.sendMessage({to:jid,body:JSON.stringify(msgObj)});
            }
        };
        mediaDevices.getUserMedia({
            audio: true,
            video: {
                audio: true,
                video: {
                    width: width,
                    height: height,
                    frameRate: 30,
                    facingMode: ("user")
                }
            },
        }).then(stream => {
            this.setState({localStream:stream});
            stanzaService.client.xmppClient.pc.addStream(stream);
        }).catch(error => {

        });


        if(route.params.isIncoming){
            console.log(stanzaService.client);
            stanzaService.client.xmppClient.pc.setRemoteDescription(route.params.offer).then(()=>{
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
        }else{
            console.log('create offer');
            console.log(stanzaService.client);

            setTimeout(() => {

                /!*stanzaService.client.xmppClient.pc.createOffer().then(offer => {
                    console.log(offer);
                    stanzaService.client.xmppClient.pc.setLocalDescription(offer).then(() => {
                        // Send pc.localDescription to peer
                        const msgObj ={
                            type:stanzaConst.MSG_TYPE_MEDIA_OFFER,
                            text:offer
                        }
                        console.log(msgObj);
                        stanzaService.client.xmppClient.sendMessage({to:jid,body:JSON.stringify(msgObj)});
                    });
                });*!/
            },1000);
        }
    }
    hangOff(){

    }

    render() {
        const {navigation,route,messageReducer,dialogReducer,chatMediaReducer,
            hangOffSession} = this.props;
        const isIncoming = route.params.isIncoming || false;
        const jid = route.params.dialog.dialogId+"@"+xmppConfig.host+"/mobile";

        setTimeout(() => {
            console.log(pc);

        },2000);
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
                            {/!*<View style={[styles.circleIcon,{backgroundColor:!this.state.isCameraFront?"white":"transparent"}]}>
                                <Icon onPress={() =>  this.setState({isCameraFront:!this.state.isCameraFront})}
                                      type="MaterialCommunityIcons" name="video-switch" size={40}
                                      color="red"/>
                                <Text style={{color:"red"}}>镜头</Text>
                            </View>*!/}
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



        return (
            <View style={styles.wrapper}>

                <View  style={styles.back}>
                    {this.state.localStream== null ? null :(<RTCView style={{backgroundColor:"black",width:width,height:height/2}} mirror={true} streamURL={this.state.localStream.toURL()}/>)}
                    {this.state.remoteStream== null ? null :(<RTCView style={{backgroundColor:"black",width:width,height:height/2}} mirror={true} streamURL={this.state.remoteStream.toURL()}/>)}
                </View>
                <View style={styles.front}>
                    <View style={{flex:1,flexDirection:"row",justifyContent:"center",alignItems:"center",backgroundColor:"transparent"}}>
                        {/!*{renderUserView}*!/}
                    </View>
                    <View style={{flex:1,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                        {renderButtonView}
                    </View>
                </View>
            </View>
        )
    }
}*/
function ChatMediaModal(props) {
    const [localStream, setLocalStream] = useState({toURL: () => null});
    const [remoteStream, setRemoteStream] = useState({toURL: () => null});
    const [isAudio,setIsAudio] = useState(false);
    const [isLoudSpeaker,setIsLoudSpeaker] = useState(false);
    const [isCameraFront,setIsCameraFront] = useState(true);
    const [isMute,setIsMute] = useState(false);
    const [status,setStatus] = useState(1);
    const {navigation,route,messageReducer,dialogReducer,chatMediaReducer,
        hangOffSession} = props;
    const isIncoming = route.params.isIncoming || false;
    const jid = route.params.dialog.dialogId+"@"+xmppConfig.host+"/mobile";


    useEffect(() => {
        console.log('----create pc ',jid);
        stanzaService.client.xmppClient.pc = new RTCPeerConnection({
            iceServers: [
                {
                    urls: 'stun:139.196.59.138:3478?transport=udp',
                },
            ],
        });
        initLocalVideo();
        registerPeerEvents();
        if(route.params.isIncoming){

        }else {
            setTimeout(() => {
                stanzaService.client.xmppClient.pc.createOffer().then(offer => {
                    stanzaService.client.xmppClient.pc.setLocalDescription(offer).then(() => {
                        const msgObj = {
                            type: stanzaConst.MSG_TYPE_MEDIA_OFFER,
                            text: offer
                        }
                        console.log(offer);
                        stanzaService.client.xmppClient.sendMessage({to: jid, body: JSON.stringify(msgObj)});
                    });
                });
            }, 1000);
        }
    }, []);

    /*useEffect(() => {

    }, [localStream]);*/
    const registerPeerEvents = () => {
        stanzaService.client.xmppClient.pc.onaddstream = event => {
            console.log('--->On Add Remote Stream');
            setRemoteStream(event.stream);
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
        mediaDevices.getUserMedia({
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
        }).then(stream => {
            setLocalStream(stream);
            stanzaService.client.xmppClient.pc.addStream(stream);
        }).catch(error => {

        });
    };

    const accept = async () => {
        console.log(route.params.offer);

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
        stanzaService.client.xmppClient.sendMessage({to:jid,body:JSON.stringify(msgObj)});
        setRemoteStream(null);
        setLocalStream(null);
        stanzaService.client.xmppClient.pc.close();
        stanzaService.client.xmppClient.pc.onicecandidate = null;
        stanzaService.client.xmppClient.pc.ontrack = null;
        navigation.goBack()
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
    )
    let acceptButton = (
        <View style={styles.circleIcon}>
            <Icon onPress={accept}
                  type="MaterialCommunityIcons" name="check" size={40}
                  color="green"/>
            <Text style={{color:"white"}}>接听</Text>
        </View>
    )
    let audioVideoToggleButton =isAudio?(
        <View style={styles.circleIcon}>
            <Icon type="MaterialCommunityIcons" name="video" size={40}
                  onPress={()=>setIsAudio(false)}
                  color="red"/>
            <Text style={{color:"white"}}>视频</Text>
        </View>):(
        <View style={styles.circleIcon}>
            <Icon type="MaterialCommunityIcons" name="microphone" size={40}
                  onPress={()=>setIsAudio(true)}
                  color="red"/>
            <Text style={{color:"white"}}>语音</Text>
        </View>);
    let muteToggleButton =(
        <View style={[styles.circleIcon,{backgroundColor:isMute?"white":"transparent"}]}>
            <Icon type="MaterialCommunityIcons" name="volume-mute" size={40}
                  onPress={()=>setIsMute(!isMute)}
                  color="green"/>
            <Text style={{color:"green"}}>静音</Text>
        </View>)
    let louderSpeakerToggleButton = (
        <View style={[styles.circleIcon,{backgroundColor:isLoudSpeaker?"white":"transparent"}]}>
            <Icon type="MaterialCommunityIcons" name="volume-high" size={40}
                  onPress={()=>setIsLoudSpeaker(!isLoudSpeaker)}
                  color="red"/>
            <Text style={{color:"red"}}>免提</Text>
        </View>)

    if(status==1) {//状态为未接通
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
            if(isAudio){//语音通话
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
                        {/*<View style={[styles.circleIcon,{backgroundColor:!isCameraFront?"white":"transparent"}]}>
                                <Icon onPress={() =>  this.setState({isCameraFront:!isCameraFront})}
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
    return (
        <View style={styles.wrapper}>

            <View  style={styles.back}>
                <RTCView style={{backgroundColor:"black",width:width,height:height/2}} mirror={true} streamURL={localStream ? localStream.toURL() : ''}/>
                {remoteStream== null ? null :(<RTCView style={{backgroundColor:"black",width:width,height:height/2}} mirror={true} streamURL={remoteStream.toURL()}/>)}
            </View>
            <View style={styles.front}>
                <View style={{flex:1,flexDirection:"row",justifyContent:"center",alignItems:"center",backgroundColor:"transparent"}}>

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
