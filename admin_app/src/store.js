import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// import rootReducer from './reducers';

import { browserHistory } from 'react-router-dom';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';

import { createBrowserHistory } from 'history'
import createRootReducer from './reducers'

export const history = createBrowserHistory()

const InitialState = {
    Intl: { locale: 'en'}
};
const midArr = [thunk, routerMiddleware(history)]

const middleware = [
    applyMiddleware(...midArr),
    ...(window.__REDUX_DEVTOOLS_EXTENSION__ ? [window.__REDUX_DEVTOOLS_EXTENSION__()] : [])
]

const store = createStore(
    createRootReducer(history),
    InitialState, 
    compose(...middleware)
);

// const history = syncHistoryWithStore(browserHistory, store);


export default store;
/*
var arr = [1, 2, 3, 4]
var [a, ...b] = arr;
console.log('a:'+a)
console.log('b',b)
*/
