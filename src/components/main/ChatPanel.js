import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Badge, Button, Container, Content, Icon, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import { updateDialogUnread } from '../../actions/DialogAction';
class ChatPanel extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {

    }

    render() {
        const { navigation, dialogReducer, updateDialogUnreadCount } = this.props;
        return (
            <Container>
                <Content>
                    <List>
                        {dialogReducer.dialogs.map((dialog, index) => {
                            return (
                                <ListItem avatar key={index}
                                    onPress={() => {
                                        navigation.navigate('chatItemScreen', { title: dialog.name, dialog: dialog });
                                        updateDialogUnreadCount(dialog);
                                    }}>
                                    <Left>
                                        <Thumbnail source={{ uri: dialog.photo }} />
                                    </Left>
                                    <Body>
                                        <Text>{dialog.dialogId}</Text>
                                        <Text note numberOfLines={2}>{dialog.lastMessage}</Text>
                                        <Text note></Text>
                                    </Body>
                                    <Right>
                                        <Text note>{new Date(dialog.lastMessageDateSent).toLocaleString()}</Text>
                                        {
                                            dialog.unreadMessagesCount > 0 &&
                                            <Badge danger>
                                                <Text>{dialog.unreadMessagesCount}</Text>
                                            </Badge>
                                        }
                                    </Right>
                                </ListItem>
                            )
                        })}
                        {/* <ListItem avatar onPress={() => {navigation.navigate('chatItem',{title:'user1'})}}>
                            <Left>
                                <Thumbnail source={{ uri: 'https://s.gravatar.com/avatar/49f4297846f70d6c070b0b604dd99175?size=100&default=retro' }} />
                            </Left>
                            <Body>
                                <Text>Kumar Pratik</Text>
                                <Text note numberOfLines={2}>Doing what you like will  . .</Text>
                                <Text note></Text>
                            </Body>
                            <Right>
                                <Text note>3:44 pm</Text>
                                <Icon note type='MaterialCommunityIcons' name='bell-off-outline' />
                            </Right>
                        </ListItem>
                        <ListItem avatar>
                            <Left>
                                <Thumbnail source={{ uri: 'https://s.gravatar.com/avatar/49f4297846f70d6c070b0b604dd99175?size=100&default=retro' }} />
                            </Left>
                            <Body>
                            <Text>Kumar Pratik</Text>
                            <Text note numberOfLines={3}>Doing what you like will  . .</Text>
                            <Text note></Text>
                            </Body>
                            <Right>
                                <Text note>3:44 pm</Text>
                                <Icon note type='MaterialCommunityIcons' name='bell-off-outline' />
                            </Right>
                        </ListItem> */}
                    </List>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        dialogReducer: state.DialogReducer
    }
}

const mapDispatchProps = (dispatch, props) => ({
    updateDialogUnreadCount: (dialog) => {
        dispatch(updateDialogUnread(dialog))
    }
})
export default connect(mapStateToProps, mapDispatchProps)(ChatPanel)
