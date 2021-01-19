import {handleActions} from 'redux-actions';
import {
    FETCH_USERS,ADD_USER,UPDATE_USER
} from '../../actions/UserAction';
import { fetchUsers } from '../ReducerUtil'
const initialState = {
    users:{}
};

export default handleActions(
    {
        [UPDATE_USER]: (state, action) => {
            const {user} = action;
            return {...state,users:{...state.users,[user._id]:user}};
        },
        [ADD_USER]: (state, action) => {
            const {user} = action;
            const copyUser = state.users[user._id] || [] ;
            return {...state,users:{...state.users,[user._id]: [user, ...copyUser]}};
        },
        [FETCH_USERS]: (state, action) => {
            return fetchUsers(action, state.users)
        }

    }
, initialState)

