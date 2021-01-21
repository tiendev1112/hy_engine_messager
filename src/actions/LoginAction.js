import {apiHost} from '../config/index'
import httpRequest from '../util/HttpRequest'
import {Alert} from 'react-native'
import * as actionTypes from '../actionTypes/index'



export const Login = (param) => async (dispatch, getState) => {

    const {props:{navigation}, value:{userName,password}} = param
    try {

        // 基本检索URL
        let url = `${apiHost}/userLogin`;
        const res = await httpRequest.post(url, {userName,password})

        console.log(res)
        if (res.success) {
            dispatch({type: actionTypes.LoginActionType.loginInit, payload: {userLogin:res.result}})
            navigation.navigate('mainStack');
        } else {
            Alert.alert("", res.msg, [{text: "确定"}])
        }

    } catch (err) {
        console.log(err)
    }

}


