import {handleActions} from 'redux-actions';
import {LoginActionTypes} from '../../types';

const initialState = {
    username: 'TestUser',
    password: ''
};

export default handleActions(
    {
        [LoginActionTypes.loginInit]: (state, action) => {
            return {
                ...state,
                data: action.payload
            }
        },
        [LoginActionTypes.setUserName]: (state, action) => {
            console.log(state);
            console.log(action);
            return {
                ...state,
                userName: action.payload
            }
        },
        [LoginActionTypes.setPassword]: (state, action) => {
            return {
                ...state,
                password: action.payload
            }
        }

    }, initialState)