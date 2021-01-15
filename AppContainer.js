import React, {Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {AppState} from 'react-native';
import {Button} from 'native-base';

//import * as XMPP from 'stanza';
const stanzaService = require('./src/service');
import {LoginScreen,ChatPanel,ContactPanel,SettingPanel} from './src/components';


const RootStack = createStackNavigator();
const LoginStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const MainStack = createStackNavigator();

const BottomTabScreen = ()=>{
    return(
        <Tab.Navigator tabBarOptions={{
            activeTintColor: '#3578e5',
        }}>
            <Tab.Screen name="Chat" component={ChatPanel} options={{
                tabBarIcon: ({ color, size }) => (
                    <Icon name="ios-home" color={color} size={size} />
                ),
            }}/>
            <Tab.Screen name="Contacts" component={ContactPanel} options={{
                tabBarIcon: ({ color, size }) => (
                    <Icon name="ios-person" color={color} size={size} />
                ),
            }}/>
            <Tab.Screen name="Settings" component={SettingPanel} options={{
                tabBarIcon: ({ color, size }) => (
                    <Icon name="ios-settings" color={color} size={size} />
                ),
            }}/>
        </Tab.Navigator>
    )
}

const MainStackScreen = ()=>{

    return (
        <MainStack.Navigator initialRouteName="login">
            <MainStack.Screen
                name="Main"
                component={BottomTabScreen}
                options={{ headerShown: false }}
            />
        </MainStack.Navigator>
    )
}
const LoginStackScreen = ()=>{
    return(
        <LoginStack.Navigator  initialRouteName="login">
            <LoginStack.Screen
                name="login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
        </LoginStack.Navigator>
    )

}

const RootStackScreen = (props)=>{
    return (
        <RootStack.Navigator mode="modal" initialRouteName={props.initialRouteName}>
            <RootStack.Screen name="loginStack" component={LoginStackScreen} options={{ headerShown: false }} />
            <RootStack.Screen
                name="mainStack"
                component={MainStackScreen}
                options={{ headerShown: false }}
            />
        </RootStack.Navigator>
    )
}
class AppContainer extends Component {

    constructor(props) {
        super(props);
        this.state={
            appState: AppState.currentState
        }
    }

    componentDidMount() {
        if(stanzaService.client == undefined){
            stanzaService.config({username:'euser1',password:'123456'});
            stanzaService.client.init({});
            stanzaService.client.xmppClient.connect();
            console.log(stanzaService);
        }
        AppState.addEventListener('change', this._handleAppStateChange);
    }
    componentWillUnmount() {
        console.log('Component unmount');
        stanzaService.client.xmppClient.disconnect();
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
    _handleAppStateChange = (nextAppState) => {
        if(nextAppState =='active'){
            console.log('navigation active ');
            stanzaService.client.xmppClient.connect({});
        }else{
            console.log('navigation inactive or backend disconnect');
            stanzaService.client.xmppClient.disconnect({});
        }
        console.log(nextAppState);
        this.setState({appState: nextAppState});
    }

    render() {
        const {} = this.props;
        return (
            <SafeAreaProvider>
                <NavigationContainer >
                    <RootStackScreen initialRouteName="loginStack"/>
                </NavigationContainer>
            </SafeAreaProvider>
        )
    }
}

const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchProps = (dispatch, props) => ({

})
export default connect(mapStateToProps, mapDispatchProps)(AppContainer)
