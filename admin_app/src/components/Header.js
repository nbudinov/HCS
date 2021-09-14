import React, { Component } from 'react';
import { SETTINGS_IMG_URL, ADMIN_URL } from '../constants.js'
import Auth from '../utils/Auth';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { setLanguage } from 'react-redux-multilang'
import history from './../history';
import { changeLanguage } from './../actions/languagesActions';
import LoadingScreen from './common/loading/LoadingScreen';
import Utils from '../utils/Utils.js';
import SnackbarNotifications from './common/SnackbarNotifications';
import { setSnackbarText, openConfirmModal } from './../actions/adminActions'
import { Button, IconButton, Slide, Snackbar } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import ConfirmModal from './common/ConfirmModal.js';
import adminImg from './../images/admin.png'; // Tell webpack this JS file uses this image.

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rerender: false,
      timerCheckForceRefresh: '',
      timeoutRefreshPage: '',
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.settings) {
      // Logo
      if (nextProps.settings.logo && nextProps.settings.logo.value) {
        this.logoSrc = nextProps.settings.logo.value
        if (this.logoSrc.indexOf("http") !== -1) {
          this.logoSrc = this.logoSrc;
        } else {
          this.logoSrc = SETTINGS_IMG_URL + this.logoSrc;
        }
      } else if (nextProps.settings.tabl_logo) {
        this.logoSrc = nextProps.settings.tabl_logo.value
      }

      if (nextProps.settings.tabl_short_logo && nextProps.settings.tabl_short_logo.value) {
        // Short logo
        this.shortLogoSrc = nextProps.settings.tabl_short_logo.value;
        if (this.shortLogoSrc.indexOf("http") !== -1) {
          this.shortLogoSrc = this.shortLogoSrc;
        } else {
          this.shortLogoSrc = SETTINGS_IMG_URL + this.shortLogoSrc;
        }
      } else if (nextProps.settings.tabl_logo) {
        this.shortLogoSrc = nextProps.settings.tabl_logo.value
      }

      // Set favicon
      let favicon = document.querySelector('link.favicon');
      if (favicon) {
        favicon.setAttribute('href', this.shortLogoSrc);
      }
    }
  }

  mySetLang = (l) => {
    this.props.setLang(l);
    // this.setState({ });
    // this.props.listCategories();
    // this.forceUpdate();


    // store.dispatch({
    //     type: 'SET_REDUX_LANGUAGE',
    //     code: 'ru'
    // })
    // this.props.setLanguage(l);
  }

  reqFullScreen() {
    var docElm = document.documentElement;
    if (docElm) {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      }
    }
  }

  // Used for raspberry with display
  stopFullScreen() {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
      else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  render() {
    const { places, clients } = this.props;

    let currPlace = '';
    let currClient = '';
    let currPlaceName = '';
    if (places) {
      currPlace = places.find(p => p.id == Auth.getUserPlace());
      currPlaceName = currPlace ? currPlace.name : "-";

      if (currPlace && Object.values(currPlace).length > 0 && currPlace.clientId) {
        currClient = clients.find(c => c.id == currPlace.clientId)
      }
    }

    let currClientSlug = '';
    if (currClient && Object.keys(currClient).length > 0 && currClient.slug) {
      currClientSlug = currClient.slug;
    }




    const transitionComponent = (props) => <Slide {...props} direction="down" />;


    // let loggedUser = Auth.getToken() ?
    //   <a className="nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
    //     <img className="img-avatar" src={ADMIN_URL + "img/avatars/admin.png"} alt="user" />
    //     {/* <img className="img-avatar" src={this.logoSrc} alt="admin@bootstrapmaster.com"/> */}
    //   </a>
    //   : '';
    return (
      <header className="app-header navbar">
        <LoadingScreen />
        <ConfirmModal />

        <button className="navbar-toggler sidebar-toggler d-lg-none mr-auto" type="button" data-toggle="sidebar-show">
          <span className="navbar-toggler-icon"></span>
        </button>


        <a className="navbar-brand logo-holder " href="javascript:void(0)">
          {/* <img className="navbar-brand-full admin-logo" src={IMG_PATH+"img/brand/logo.svg"} width="89" height="25" alt="CoreUI Logo"/>
        <img className="navbar-brand-minimized" src={IMG_PATH+"img/brand/sygnet.svg"} width="30" height="30" alt="CoreUI Logo"/> */}

          {/* <img className="navbar-brand-full admin-logo" src={'https://tabl.bg/img/tabl-transparent.png'} alt="TabL Logo" /> */}
          <h2 className="navbar-brand-full admin-logo" style={{fontSize: "3.75rem", marginLeft: 33, maxHeight: 70 }}>HCS</h2>
          {/* <img className="navbar-brand-full admin-logo" src={this.logoSrc} alt="TabL Logo"/> */}
          {/* <img className="navbar-brand-minimized admin-logo" src={'https://tabl.bg/img/tabl-transparent.png'}  alt="TabL Logo" /> */}
        </a>


        <SnackbarNotifications
          snackbarText={this.props.snackbarText}
          setSnackbarText={this.props.setSnackbarText}
          snackbarActionCallback={this.props.snackbarActionCallback}
          snackbarActionText={this.props.snackbarActionText}
        />

        < ul className="nav navbar-nav ml-auto" >

          {Auth.hasAccess("SUPER_ADMIN") && this.props.places.length > 1 ?
            <li className="nav-item place-header">
              <NavLink to={ADMIN_URL + `places/current`} className="nav-link">
                <span className="badge badge-secondary fsize-13" style={{ position: 'initial' }}>{currPlaceName}</span>
              </NavLink>
            </li>
            :
            null
          }

          &nbsp;

          <li >
            {/* <button className="btn" style={localStorage.getItem('default_lang') == 'ro' ? { background: '#d8d8d8' } : { marginRight: 5 }} onClick={() => this.props.changeLanguage('ro')}>RO</button> */}
            <button className="btn" style={localStorage.getItem('default_lang') == 'en' ? { background: '#d8d8d8' } : { marginRight: 5 }} onClick={() => this.props.changeLanguage('en')}>EN</button>
            <button className="btn" style={!localStorage.getItem('default_lang') || localStorage.getItem('default_lang') == 'bg' ? { background: '#d8d8d8' } : { marginRight: 5 }} onClick={() => this.props.changeLanguage('bg')}>BG</button>
          </li>


          {
            Auth.getToken() ?
              <li className="nav-item dropdown show dropdownicons-black" style={{ paddingRight: 10 }}>
                <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                  <img
                    // src="img/avatars/6.jpg"
                    src={adminImg}
                    className="img-avatar" alt="user" />
                </a>

                <div className="dropdown-menu dropdown-menu-right " style={{ maxHeight: '90vh', overflowY: 'scroll' }}>

                  <div className="dropdown-header text-center">
                    <strong>{Auth.getToken() ? Auth.getDecodedUser().email : null} - {Auth.getToken() ? this.props.translations.roles[Auth.getDecodedUser().role] : null} - <i className="fas fa-lock c-pointer" title={'Изход'} onClick={this.props.logoutAction}></i>
                    </strong>
                  </div>

                  <div className="dropdown-header text-center">
                    <strong>Профил</strong>
                  </div>


                  <button className="dropdown-item c-pointer" onClick={this.props.logoutAction}>
                    <i className="fas fa-lock"></i> Изход
                  </button>

                </div>
              </li>
              :
              null
          }

        </ul >
      
      </header >
    )
  }
}


const mapStateToProps = state => {

  return {
    clients: state.clients.clients,
    places: state.places.places,
    translations: state.lang,
    snackbarText: state.admin.snackbarText,
    snackbarActionCallback: state.admin.snackbarActionCallback,
    snackbarActionText: state.admin.snackbarActionText,
  }
};

export default connect(mapStateToProps, { changeLanguage, setSnackbarText, openConfirmModal })(Header);