import React, {Component} from 'react';
import {View} from 'react-native';
import {Button, Container, Content, Form, Item, Input, Label,Right,Text } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';


class LoginScreen extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        /* XMPPMain.init({username:'user1',password:'123456'});
         XMPPMain.client.connect({});*/

    }

    render() {
        const {navigation} = this.props;
        return (

            <Container>
                <Content>
                    <View style={{
                        flex: 1,
                        flexDirection:"row",
                        justifyContent:"flex-end",
                        paddingRight:20
                    }}>
                        <Button transparent  onPress={() => navigation.goBack()} >
                            <Icon primary name="md-close-sharp" size={30} />
                        </Button>
                    </View>
                    <Form>
                        <Item floatingLabel>
                            <Label>Username</Label>
                            <Input />
                        </Item>
                        <Item floatingLabel>
                            <Label>Password</Label>
                            <Input />
                        </Item>
                    </Form>
                    <Button block style={{ margin: 15, marginTop: 50 }} onPress={() => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'mainStack' }],
                        });
                    }}>
                        <Text>Login</Text>
                    </Button>
                    <View  style={{flex: 1, flexDirection:'row',justifyContent: 'space-between'}}>
                        <Button  transparent light >
                            <Text>Forget Password ?</Text>
                        </Button>
                        <Button transparent >
                            <Text>Sign Up</Text>
                        </Button>
                    </View>
                </Content>
            </Container>

        )
    }
}

const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchProps = (dispatch, props) => ({

})
export default connect(mapStateToProps, mapDispatchProps)(LoginScreen)
