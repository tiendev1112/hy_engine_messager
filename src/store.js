import {createStore, applyMiddleware, compose} from 'redux';
import ReduxThunk from 'redux-thunk';
import { persistStore } from 'redux-persist'
import reducers  from './reducers'
const store = compose(
    applyMiddleware(ReduxThunk)
)(createStore)(reducers);
let persistor = persistStore(store)
export  {store,persistor}