import {getItemObject, setItemObject} from '../util/LocalStorage';
import LocalStorageKey from '../util/LocalStorageKey';
import {apiHost} from '../config/index';
import httpRequest from '../util/HttpRequest';
import * as LoginAction from "./LoginAction"
import {Alert} from "react-native";
import {setCurrentUser} from './CurrentUserActions';
export const SHOW_WELCOME = 'SHOW_WELCOME';

/**
 *  如果获取用户信息失败，跳转到登录，换token，如果更新token失败，跳转到登录，如果更新token成功，继续流程
 */
export const show = (props) => async (dispatch) =>  {
   //读取local
    const localUserObj = await getItemObject(LocalStorageKey.USER);
    // console.log(localUserObj);
    if(localUserObj) {
        //换取token
        const {accessToken, userId,status,userName,jid,impwd} = localUserObj
        const url = `${apiHost}/user/${userId}/token/${accessToken}`
        // console.log('url', url)
        const res = await httpRequest.get(url)
       //console.log('res', res)
       //成功 换accessToken 更新reducer 更新LocalStorage
        if (res.success) {
            const userObj = {accessToken : res.result.accessToken, status , userId , userName, jid, impwd}
            await setItemObject(LocalStorageKey.USER,userObj);
             dispatch(setCurrentUser({...userObj,avatar: 'http://myxxjs.com/assets/img/logo.png'}));
            dispatch({type: LoginAction.loginInit, payload: {user:userObj}})
            props.navigation.reset({index:0,routes:[{name:'mainStack'}]});
        } else {
            props.navigation.reset({index:0,routes:[{name:'loginStack'}]});

        }
    }else {
        props.navigation.reset({index:0,routes:[{name:'loginStack'}]});
    }
}


