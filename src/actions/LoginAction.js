import {Alert} from 'react-native';

import {apiHost} from '../config/index';
import httpRequest from '../util/HttpRequest';
import * as actionTypes from '../actionTypes/index';
import store from '../store';
import {clearDialog} from './DialogAction';
import {clearMessage} from './MessageAction';
import {getItemObject,setItemObject,getAllKeys} from '../util/LocalStorage';
import LocalStoragekey from '../util/LocalStorageKey';
import stanzaService from '../service'




export const Login = (param) => async (dispatch, getState) => {

    const {props:{navigation}, value:{userName,password}} = param;
    console.log(param);
    try {

        // 基本检索URL
        let url = `${apiHost}/userLogin`;
        const res = await httpRequest.post(url, {userName,password})

        console.log(res)
        if (res.success) {
            const userObj = {
                accessToken : res.result.accessToken,
                status : res.result.status,
                userId : res.result.userId,
                userName : res.result.userName,
                jid :res.result.jid,
                impwd : res.result.impwd,
            }
            const localStorageUser = await getItemObject(LocalStoragekey.USER);
            if(localStorageUser.jid && localStorageUser.jid == userObj.jid ){
                //缓存用户信息与新用户信息一致
            }else{
                //不一致清除redux-persist
                dispatch(clearDialog());
                dispatch(clearMessage());
            }
            await setItemObject(LocalStoragekey.USER,userObj);
            if(stanzaService.client && stanzaService.client.xmppClient){
                stanzaService.client.xmppClient.disconnect();
            }


            stanzaService.config({username:userObj.jid,password:userObj.impwd});
            stanzaService.client.init({});
            stanzaService.client.xmppClient.connect();
            dispatch({type: actionTypes.LoginActionType.loginInit, payload: {userLogin:res.result}})
            navigation.navigate('mainStack');
        } else {
            console.log(res)
            Alert.alert("", res.msg, [{text: "确定"}])
        }

    } catch (err) {
        console.log(err)
    }

}


