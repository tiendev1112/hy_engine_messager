import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Badge,Button,Container, Content, Icon,List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
class ChatPanel extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {

    }

    render() {
        const {navigation,dialogReducer,updateDialogUnreadCount} = this.props;
        return (
            <Container>
                <Content>
                    <List>
                        <ListItem avatar onPress={() => {navigation.navigate('chatItem',{title:'user1'})}}>
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
                        </ListItem>
                    </List>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {

}

const mapDispatchProps = (dispatch, props) => ({

})
export default connect(mapStateToProps, mapDispatchProps)(ChatPanel)
