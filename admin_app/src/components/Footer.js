import React, { Component } from 'react'
import Auth from '../utils/Auth';
import { ADMIN_VERSION } from '../constants'

export default class Footer extends Component {
  render() {
    let loginMargin = Auth.getToken() ? {} : { margin: '0' };
    // color: 'pink'
    return (
      <footer className="app-footer" style={loginMargin}>
        <div>
          <span>&copy; 2021 All rights reserved.</span>
        </div>
        <div className="ml-auto">
          <span></span>
          {/* <a href="https://tabl.bg/aboutus" target="_blank"> */}
            {/* TabL.BG - v{ADMIN_VERSION} */}
          {/* </a> */}
          <span></span>
          {/* <a href="https://coreui.io" target="_blank">CoreUI</a> */}
        </div>
      </footer>
    )
  }
}
