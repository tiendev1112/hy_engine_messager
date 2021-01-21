import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Dimensions,StyleSheet,View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    RTCPeerConnection,
    registerGlobals
} from 'react-native-webrtc';

import {xmppConfig} from "../../config";
const stanzaService = require('../../service');

registerGlobals();
const {height,width} = Dimensions.get('window');
const configuration = {"iceServers": [{"url": "stun:139.196.59.138:3478?transport=udp"},{"url": "turn:139.196.59.138:3478?transport=udp"}]};


class ChatMediaModal extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const {route} = this.props;
        const jid = route.params.dialog.dialogId+"@"+xmppConfig.host+"/mobile";
        stanzaService.client.xmppClient.jingle.on('peerTrackAdded', (session, track, stream)=>{
            console.log("peerTrackAdded");
            console.log(session);
            console.log(track);
            console.log(stream);
        });
        stanzaService.client.xmppClient.on('jingle:incoming', (session, track, stream)=>{
            console.log("jingle:incoming");
            console.log(session);
            console.log(track);
            console.log(stream);
            session.accept();
        });
        stanzaService.client.xmppClient.jingle.iceServers =configuration.iceServers;
        const mediaSession = stanzaService.client.xmppClient.jingle.createMediaSession(jid);
        mediaSession.start();
    }


    render() {
        const {navigation,route,messageReducer,currentUserReducer,dialogReducer} = this.props;
        console.log(route.params.dialog);
        return (
            <View style={styles.wrapper}>
                <View  style={styles.back}>

                </View>
                <View style={styles.front}>
                    <View style={{flex:1,justifyContent:"center",backgroundColor:"transparent"}}></View>
                    <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>
                        <Icon onPress={() =>  navigation.goBack()}
                              type="MaterialCommunityIcons" name="phone-off-outline" size={40}
                              color="red"/>
                        <Icon onPress={() =>  navigation.goBack()}
                              type="MaterialCommunityIcons" name="check" size={40}
                              color="green"/>
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
    }
});
const mapStateToProps = (state) => {
    return {
        messageReducer: state.MessageReducer,
        dialogReducer: state.DialogReducer,
        currentUserReducer:state.CurrentUserReducer
    }
}

const mapDispatchProps = (dispatch, props) => ({
})
export default connect(mapStateToProps, mapDispatchProps)(ChatMediaModal)
