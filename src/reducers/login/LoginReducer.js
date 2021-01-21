import {handleActions} from 'redux-actions';
import * as actionTypes from "../../actionTypes"

const initialState = {
    data:{
        accessToken:'',
        status:'',
        type:'',
        userId:'',
        userName:'',
        jid:'',
        impwd:''

    }
};

export default handleActions(
    {
        [actionTypes.LoginActionType.loginInit]: (state, action) => {
            const {userLogin:{accessToken,status,type,userId,userName,jid,impwd}}=action.payload
            return {
                data: {
                    accessToken,
                    status,
                    type,
                    userId,
                    userName,
                    jid,
                    impwd
                }
            }
        },

    }, initialState)
