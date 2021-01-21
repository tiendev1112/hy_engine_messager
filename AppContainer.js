import React, {Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {AppState} from 'react-native';
import {Button} from 'native-base';

import AsyncStorage from '@react-native-async-storage/async-storage';

import localStorageKey from './src/util/LocalStorageKey'
import {getItemValue,getItemObject,getAllKeys} from './src/util/LocalStorage'
import {LoginScreen,ChatItemScreen,ChatMediaModal,ChatPanel,ContactPanel,SettingPanel,WelcomeScreen} from './src/components';
import {store} from './src/store';
import {updateDialogUnread} from './src/actions/DialogAction'
const stanzaService = require('./src/service');


const RootStack = createStackNavigator();
const LoginStack = createStackNavigator();
const WelcomeStack = createStackNavigator();
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

const MainStackScreen = (props)=>{

    return (
        <MainStack.Navigator initialRouteName="login">
            <MainStack.Screen
                name="Main"
                component={BottomTabScreen}
                options={{ headerShown: false }}
            />
            <MainStack.Screen
                name="chatItemScreen"
                component={ChatItemScreen}
                options={({ navigation, route }) => ({
                    title: route.params.title,
                    headerTitleStyle: {
                        color: '#3578e5',
                    },
                    headerRight: (props)=>{
                        return <Button  transparent {...props} onPress={() => {
                            navigation.navigate('chatMediaModal',{dialog:route.params.dialog})
                        }}>

                            <Icon name='call' size={30} color='#3578e5'/>
                        </Button>},
                    headerLeft: (props)=>{
                        return <Button  transparent {...props} onPress={() => {
                            navigation.goBack();
                            store.dispatch(updateDialogUnread(route.params.dialog));
                        }}>

                            <Icon name='chevron-back-outline' size={30} color='#3578e5'/>
                        </Button>}})}

            />
            <MainStack.Screen
                name="chatMediaModal"
                component={ChatMediaModal}
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
const WelcomeStackScreen = ()=>{
    return(
        <WelcomeStack.Navigator  initialRouteName="welcome">
            <WelcomeStack.Screen
                name="welcome"
                component={WelcomeScreen}
                options={{ headerShown: false }}
            />
        </WelcomeStack.Navigator>
    )

}

const RootStackScreen = (props)=>{
    return (
        <RootStack.Navigator mode="modal" initialRouteName={props.initialRouteName}>
            <RootStack.Screen name="welcomeStack" component={WelcomeStackScreen} options={{ headerShown: false }} />
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

    componentDidMount(props) {
        console.log(this);
        /*if(stanzaService.client == undefined){
            stanzaService.config({username:'euser1',password:'123456'});
            stanzaService.client.init({});
            stanzaService.client.xmppClient.connect();
            console.log(stanzaService);
        }*/

        console.log(getAllKeys())
        AppState.addEventListener('change', this._handleAppStateChange);
    }
    componentWillUnmount() {
        console.log('Component unmount');
        //stanzaService.client.xmppClient.disconnect();
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
    _handleAppStateChange = (nextAppState) => {
        /*if(nextAppState =='active'){
            console.log('navigation active ');
            stanzaService.client.xmppClient.connect({});
        }else{
            console.log('navigation inactive or backend disconnect');
            stanzaService.client.xmppClient.disconnect({});
        }
        console.log(nextAppState);*/
        this.setState({appState: nextAppState});
    }

    render() {

        return (
            <SafeAreaProvider>
                <NavigationContainer >
                    <RootStackScreen initialRouteName="welcomeStack"/>
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
