import React, { Component } from 'react';
import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

import MyRouter from "./MyRouter";
import Header from './components/Header';
import SideBar from './components/SideBar';
import Footer from './components/Footer';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import Auth from './utils/Auth';
import {logout} from './actions/authActions'

library.add(faEnvelope, faKey);

class App extends Component {

  render() {

    let sideBar = Auth.isUserAuthenticated() ? <SideBar/> : "";

    return (
      <React.Fragment>
        <Header logoutAction={logout}/>
          <div className="app-body"> 
            {sideBar}
            <MyRouter />
          </div>
        <Footer/>
      </React.Fragment>
    );
  }
}

export default App;
