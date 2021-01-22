import {handleActions} from 'redux-actions';
import * as LoginAction from "../../actions/LoginAction"

const initialState = {
    data:{
      user:{}

    }
};

export default handleActions(
    {
        [LoginAction.loginInit]: (state, action) => {
            const {user}=action.payload
            return {
                data: {
                   user
                }
            }
        },

    }, initialState)
