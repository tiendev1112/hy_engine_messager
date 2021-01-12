import {createStore, applyMiddleware, compose} from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers  from './reducers'
const store = compose(
    applyMiddleware(ReduxThunk)
)(createStore)(reducers);
export default store