import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Animated,Easing,Image,View,TouchableOpacity} from 'react-native';
import { Container, Content, Icon,List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import {
    Bubble,GiftedChat,Message,MessageText
} from 'react-native-gifted-chat';

import {updateDialogUnread} from '../../actions/DialogAction';
const stanzaService = require('../../service');
import {xmppConfig} from "../../config";

class ChatItemScreen extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {

    }
    sendMessage = (userId,message)=>{
        console.log(userId)
        console.log(message)
        stanzaService.client.xmppClient.sendMessage({to:userId+"@"+xmppConfig.host,body:message[0].text});
    }
    renderMessageText = (props) => {

        return (
            <MessageText
                {...props}
            />
        )
    };
    renderMessage =(props)=> {
        return (
            <Animated.View onPress={() => {console.log('press message')}}>
                <Message
                    {...props}
                />
            </Animated.View>
        )
    }
    renderBubble = props => {
        return (
            <Bubble
                {...props}
                containerToNextStyle={{
                    left: { borderColor: '#46CF76', borderWidth: 4 },
                    right: {},
                }}
                containerToPreviousStyle={{
                    left: { borderColor: '#46CF76', borderWidth: 4 },
                    right: {borderColor: '#46CF76', borderWidth: 4 },
                }}
                textStyle={{
                    right: {
                        color: '#fff',
                    },
                    left: {
                        color: '#0f2f2f',
                    },
                }}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#46CF76',
                    },
                    left: {
                        backgroundColor: '#fff',
                    },
                }}
            />
        );
    }

    render() {
        const {navigation,route,messageReducer,currentUserReducer,dialogReducer} = this.props;

        return (
            <View style={{flex:1,flexDirection:'column'}}>

                <GiftedChat
                    alignTop
                    placeholder="请输入信息"
                    messages={messageReducer.messages[route.params.dialog.dialogId]}
                    renderBubble={this.renderBubble}
                    renderMessage={this.renderMessage}
                    renderMessageText={this.renderMessageText}
                    showUserAvatar={true}
                    onSend={messages=>this.sendMessage(route.params.dialog.dialogId,messages)}
                    user={{
                        _id: 'euser1',
                        name: 'React Native',
                        avatar: 'https://facebook.github.io/react/img/logo_og.png',
                    }}
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        messageReducer: state.MessageReducer,
        dialogReducer: state.DialogReducer
    }
}

const mapDispatchProps = (dispatch, props) => ({
    updateDialogUnreadCount: (dialog) => {
        dispatch(updateDialogUnread(dialog))
    }
})
export default connect(mapStateToProps, mapDispatchProps)(ChatItemScreen)
