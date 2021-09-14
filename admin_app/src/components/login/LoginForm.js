import React, { Component } from 'react';
import { connect } from 'react-redux';

class LoginForm extends Component {
    constructor(props) {
        super(props);
       
    }

    render() {
        return (
            <div className="col-md-6 col-md-offset-3 m0auto mtop50">
                <h2>{this.props.translations.login.title}</h2>
                <form name="form" onSubmit={this.props.onSubmit}>
                    <div className={'form-group'}>
                        <label htmlFor="username">{this.props.translations.login.email}</label>
                        <input type="text" className="form-control" name="email" value={this.props.email} onChange={this.props.onChange} />
                    </div>
                    <div className={'form-group'}>
                        <label htmlFor="password">{this.props.translations.login.password}</label>
                        <input type="password" className="form-control" name="password" value={this.props.password} onChange={this.props.onChange} />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">{this.props.translations.login.login}</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default connect(null, {  })(LoginForm);
