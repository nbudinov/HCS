import browserSupport from './utils/browsersSupport';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store, { history } from './store';
import { ConnectedRouter } from 'connected-react-router'

import { BrowserRouter } from 'react-router-dom'
import { listLanguages } from './actions/languagesActions';
import { listPlacesByUserRole } from './components/places/actions/places.actions';
import { listClients } from './components/clients/actions/clients.actions';

import { clearMessages } from './components/messages/messages.actions';
import { setCurrentUser, logout } from './actions/authActions';
import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';

import Auth from './utils/Auth';
import setAuthorizationToken from './utils/setAuthorizationToken';
import axios from 'axios';
import setCustomAdminHeader from './utils/setCustomAdminHeader';
import setTablHeader from './utils/setTablHeader';
import setCustomPlaceHeader from './utils/setCustomPlaceHeader';
// import {syncWithStore, setLanguage} from 'react-redux-multilang';
// Store to state languages
import Cookies from 'universal-cookie';
const cookies = new Cookies();

setCustomAdminHeader();
setTablHeader();

if (Auth.getToken()) {
    try {
        // jwtDecode(Auth.getToken());
        let currUser = jwtDecode(Auth.getToken());
        store.dispatch(setCurrentUser(currUser));
        setAuthorizationToken(Auth.getToken());

        if(cookies.get('tabl_a_place')) {
            setCustomPlaceHeader(cookies.get('tabl_a_place'));
        } else {
            setCustomPlaceHeader(currUser.place_id);
        }

        store.dispatch(listPlacesByUserRole());
        store.dispatch(listLanguages());

    } catch (e) {
        // console.log(e);
    }
}

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response && error.response.status && error.response.status == 401) {
        store.dispatch(logout());
        return;
    } else {
        // if(error.response.data.error.errors) {
        // store.dispatch(addErrorMessages(error.response.data.error.errors));
        // TODO: Tuk moje napravo da vikam addErrorMsgs()
        // }
    }
    return Promise.reject(error);
});


const onlisten = history.listen((location, action) => {
    store.dispatch(clearMessages());
})

const app =
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>

ReactDOM.render(app, document.getElementById('root'));

