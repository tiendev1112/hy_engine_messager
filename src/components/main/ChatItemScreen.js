import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Animated, Easing, Image, View, Text, TouchableOpacity } from 'react-native';
import { Container, Content, Icon, List, ListItem, Left, Body, Right, Thumbnail } from 'native-base';
import {
    Bubble, GiftedChat, Message, MessageText
} from 'react-native-gifted-chat';

import { updateDialogUnread } from '../../actions/DialogAction';
import { xmppConfig } from "../../config";
import * as stanzaConst from '../../service/StanzaConst';
const stanzaService = require('../../service');

class ChatItemScreen extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {

    }
    sendTextMessage = (userId, message) => {
        const msgObj = {
            type: stanzaConst.MSG_TYPE_TEXT,
            text: message[0].text
        }
        stanzaService.client.xmppClient.sendMessage({ to: userId + "@" + xmppConfig.host, body: JSON.stringify(msgObj) });
    }
    renderMessageText = (props) => {

        return (
            <MessageText
                {...props}
            />
        )
    };
    renderTime = (props) => {
        console.log(props.currentMessage);
        return (
            <Text>{new Date(props.currentMessage.createdAt).toLocaleTimeString()}</Text>
        )
    };
    renderMessage = (props) => {
        return (
            <Animated.View onPress={() => { console.log('press message') }}>
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
                    right: { borderColor: '#46CF76', borderWidth: 4 },
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
        const { navigation, route, messageReducer, currentUserReducer, dialogReducer } = this.props;
        return (
            <View style={{
                flex: 1, flexDirection: 'column', justifyContent: "center",
            }}>

                <GiftedChat
                    alignTop
                    placeholder="Please enter information"
                    messages={messageReducer.messages[route.params.dialog.dialogId]}
                    renderBubble={this.renderBubble}
                    renderMessage={this.renderMessage}
                    renderMessageText={this.renderMessageText}
                    showUserAvatar={true}
                    onSend={messages => this.sendTextMessage(route.params.dialog.dialogId, messages)}
                    user={currentUserReducer.user}
                    timeFormat="HH:mm"
                    dateFormat="YYYY-MM-DD"
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        messageReducer: state.MessageReducer,
        dialogReducer: state.DialogReducer,
        currentUserReducer: state.CurrentUserReducer
    }
}

const mapDispatchProps = (dispatch, props) => ({
    updateDialogUnreadCount: (dialog) => {
        dispatch(updateDialogUnread(dialog))
    }
})
export default connect(mapStateToProps, mapDispatchProps)(ChatItemScreen)
