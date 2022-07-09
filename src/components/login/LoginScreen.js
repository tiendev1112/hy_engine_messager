import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button, Container, Content, Form, Item, Input, Label, Right, Text } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import * as action from '../../actions/index'

class LoginScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: 'tien123@gmail.com',
            password: 'mektoube'
        }

    }

    componentDidMount() {
        /* XMPPMain.init({username:'user1',password:'123456'});
         XMPPMain.client.connect({});*/

    }


    render() {

        const { navigation, login } = this.props;
        return (

            <Container>
                <Content>
                    <View style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        paddingRight: 20,
                        paddingTop: 60
                    }}>

                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                        <Image style={{ width: 200, height: 200 }} source={require('../../../assets/images/logo.png')} />
                    </View>
                    <Form>
                        <Item floatingLabel>
                            <Label>user</Label>
                            <Input value={this.state.userName} onChangeText={(e) => this.setState({ userName: e })} />
                        </Item>
                        <Item floatingLabel>
                            <Label>password</Label>
                            <Input value={this.state.password} onChangeText={(e) => this.setState({ password: e })} />
                        </Item>
                    </Form>
                    <Button block style={{ margin: 15, marginTop: 50 }} onPress={() => {
                        login({ userName: this.state.userName, password: this.state.password })
                    }}>
                        <Text>Log in</Text>
                    </Button>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button transparent  >
                            <Text>Forgot password?</Text>
                        </Button>
                        <Button transparent >
                            <Text>Register</Text>
                        </Button>
                    </View>
                </Content>
            </Container>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        loginReducer: state.LoginReducer
    }
}

const mapDispatchProps = (dispatch, props) => ({
    login: (value) => {
        dispatch(action.LoginAction.Login({ props, value }))
    },
})
export default connect(mapStateToProps, mapDispatchProps)(LoginScreen)
