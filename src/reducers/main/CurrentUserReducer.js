import {handleActions} from 'redux-actions';
import {
    SET_CURRENT_USER
} from '../../actions/CurrentUserActions';
import { fetchUsers } from '../ReducerUtil'
const initialState = {
    user:{}
};

export default handleActions(
    {
        [SET_CURRENT_USER]: (state, action) => {
            const {currentUser} = action;
            return {user:currentUser};
        }

    }
    , initialState)

