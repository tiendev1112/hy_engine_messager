import { getItemObject, setItemObject } from '../util/LocalStorage';
import LocalStorageKey from '../util/LocalStorageKey';
import { apiHost } from '../config/index';
import httpRequest from '../util/HttpRequest';
import * as LoginAction from "./LoginAction"
import { Alert } from "react-native";
import { setCurrentUser } from './CurrentUserActions';
import stanzaService from '../service'


export const SHOW_WELCOME = 'SHOW_WELCOME';

/**
 *  If the acquisition of user information fails, go to login, change the token, if the update token fails, go to login, if the update token is successful, continue the process
 */
export const show = (props) => async (dispatch) => {
    //read local
    const localUserObj = await getItemObject(LocalStorageKey.USER);
    if (localUserObj) {
        //Exchange token
        const { accessToken, userId, status, userName, jid, impwd } = localUserObj
        const url = `${apiHost}/user/${userId}/token/${accessToken}`
        // console.log('url', url)
        const res = await httpRequest.get(url)
        //console.log('res', res)
        //Successfully change accessToken, update reducer, update LocalStorage
        if (res.success) {
            const userObj = { accessToken: res.result.accessToken, status, userId, userName, jid, impwd }
            await setItemObject(LocalStorageKey.USER, userObj);
            dispatch(setCurrentUser({ ...userObj, avatar: 'http://myxxjs.com/assets/img/logo.png' }));
            stanzaService.config({ username: userObj.jid, password: userObj.impwd });
            stanzaService.client.init(props.navigation);
            console.log(stanzaService.client.xmppClient);
            stanzaService.client.xmppClient.connect();
            dispatch({ type: LoginAction.loginInit, payload: { user: userObj } })
            props.navigation.reset({ index: 0, routes: [{ name: 'mainStack' }] });
        } else {
            props.navigation.reset({ index: 0, routes: [{ name: 'loginStack' }] });

        }
    } else {
        props.navigation.reset({ index: 0, routes: [{ name: 'loginStack' }] });
    }
}


