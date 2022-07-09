import React, { Component } from 'react';
import { View, Dimensions, StyleSheet, Alert } from 'react-native';
import { Button, Container, Content, Icon, Left, Body, Right, List, ListItem, Thumbnail, Separator, Text } from 'native-base'
import { connect } from 'react-redux';
import { cleanLogin } from '../../actions/LoginAction'

const { height, width } = Dimensions.get('window');

class SettingPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmModalVisible: false
        }


    }

    componentDidMount() {

    }
    exitApp = () => {
        this.setState({ confirmModalVisible: true })
    }

    onPressOk = () => {
        this.setState({ confirmModalVisible: false })
        this.props.cleanLogin()
    }

    onPressCancel = () => {
        this.setState({ confirmModalVisible: false })
    }

    render() {
        const { navigation } = this.props;

        return (
            <Container>
                <Content style={styles.container}>
                    <List style={styles.list}>
                        <Separator style={{ height: 40 }} >
                            <Text>Accounts</Text>
                        </Separator>
                        <ListItem icon onPress={() => { }}>
                            <Left>
                                <Thumbnail small source={{ uri: 'http://myxxjs.com/assets/img/logo.png' }} />
                            </Left>
                            <Body>
                                <Text style={{ fontSize: 14, color: '#777' }}>user2</Text>
                            </Body>
                            <Right>
                                <Icon name="ios-chevron-forward" />
                            </Right>
                        </ListItem>
                        <ListItem icon last onPress={() => { }}>

                            <Body>
                                <Text style={{ fontSize: 14, color: '#777' }}>add account</Text>
                            </Body>
                            <Right>
                                <Icon name="ios-chevron-forward" />
                            </Right>
                        </ListItem>
                        <Separator style={{ height: 40 }} >
                            <Text>Status</Text>
                        </Separator>
                        <ListItem icon last onPress={() => { }}>

                            <Body>
                                <Text style={{ fontSize: 14, color: '#777' }}>Automatic</Text>
                            </Body>
                            <Right>
                                <Icon name="ios-chevron-forward" />
                            </Right>
                        </ListItem>


                        <Separator style={{ height: 40 }} >
                            <Text>Settings</Text>
                        </Separator>
                        <ListItem icon onPress={() => { }}>

                            <Body>
                                <Text style={{ fontSize: 14, color: '#777' }}>Chats</Text>
                            </Body>
                            <Right>
                                <Icon name="ios-chevron-forward" />
                            </Right>
                        </ListItem>
                        <ListItem icon onPress={() => { }}>

                            <Body>
                                <Text style={{ fontSize: 14, color: '#777' }}>Contacts</Text>
                            </Body>
                            <Right>
                                <Icon name="ios-chevron-forward" />
                            </Right>
                        </ListItem>
                        <ListItem icon onPress={() => { }}>

                            <Body>
                                <Text style={{ fontSize: 14, color: '#777' }}>Notifications</Text>
                            </Body>
                            <Right>
                                <Icon name="ios-chevron-forward" />
                            </Right>
                        </ListItem>
                        <ListItem icon onPress={() => { }}>

                            <Body>
                                <Text style={{ fontSize: 14, color: '#777' }}>Experimental</Text>
                            </Body>
                            <Right>
                                <Icon name="ios-chevron-forward" />
                            </Right>
                        </ListItem>
                        <ListItem icon onPress={() => { }}>

                            <Body>
                                <Text style={{ fontSize: 14, color: '#777' }}>Media</Text>
                            </Body>
                            <Right>
                                <Icon name="ios-chevron-forward" />
                            </Right>
                        </ListItem>
                        <ListItem icon last onPress={() => { }}>

                            <Body>
                                <Text style={{ fontSize: 14, color: '#777' }}>About</Text>
                            </Body>
                            <Right>
                                <Icon name="ios-chevron-forward" />
                            </Right>
                        </ListItem>

                    </List>
                    <Button full style={styles.button} onPress={this.exitApp}>
                        <Text style={styles.buttonTitle}>quit</Text>
                    </Button>
                </Content>

                {this.state.confirmModalVisible && Alert.alert(
                    '',
                    'Confirm to exit the app?',
                    [
                        { text: 'Sure', onPress: this.onPressOk },
                        { text: 'Cancel', onPress: this.onPressCancel },
                    ],
                )
                }
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff"
    },
    list: {
        backgroundColor: '#fff',
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    userContainer: {
        marginLeft: 10
    },
    button: {
        margin: 15,
        marginTop: 40,
        backgroundColor: '#1a50bd'
    },
    buttonTitle: {
        color: '#fff',
        fontSize: 14,
    },
    separator: {
        height: 20
    }
})
const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchProps = (dispatch, props) => ({
    cleanLogin: () => {
        dispatch(cleanLogin(props))
    }
})
export default connect(mapStateToProps, mapDispatchProps)(SettingPanel)
