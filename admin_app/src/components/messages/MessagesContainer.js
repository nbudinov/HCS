import React, {Component} from 'react';
import { connect } from 'react-redux';
import {logout} from './../../actions/authActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class MessagesContainer extends Component {
	render() {
		let errors = [];
		
		if(this.props.data == 'Unauthorized') {
			this.props.logout();
			return ;
		} else {

			// for when error.response.data == "String"
			if(this.props.errors && this.props.errors.response && this.props.errors.response.data && typeof this.props.errors.response.data === 'string') {
				let errorMsg = this.props.errors.response.data;
				errorMsg = this.props.translations && this.props.translations.messages.errors[errorMsg] || errorMsg;
				errors.push(errorMsg);

			// for when error.response.data == {error: { errors: [ {message: 'err msg'} ] }}
			}else if(this.props.errors && this.props.errors.response && this.props.errors.response.data && this.props.errors.response.data.error && this.props.errors.response.data.error.errors) {
				this.props.errors.response.data.error.errors.map(errObj => {
					let errorMsg = errObj.message;
					errorMsg = this.props.translations && this.props.translations.messages.errors[errorMsg] || errorMsg;
					errors.push(errorMsg);
				})

			// Същото като горното но съм подал error.response.data		
			} else if(this.props.errors.length > 0 && typeof this.props.errors[0] === 'object' && this.props.errors[0] !== null) {
				this.props.errors.map(errObj => {
					errors.push(errObj.message);
				})
			} else if(this.props.errors.length > 0 && typeof this.props.errors[0] === 'string') {
				errors = this.props.errors;
			}
	
		}
		let k = 0;

		errors.map(e => {
			toast.error(e, {
				theme: "colored"
			  });
		})

		if(this.props.success.length > 0) {
			toast.success(this.props.success, {
				theme: "colored"
			  })
		}

		return (
			<ToastContainer
				position="top-right"
				autoClose={8000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		// <div className="errors-container">



		// 	{errors.length > 0 ?
		// 		errors.map(e => (
		// 			<div key={k++} className="alert alert-danger fade show" role="alert">
		// 				{e}
		// 			</div>
		// 		))
		// 	:
		// 		''
		// 	}
				
		// 	{this.props.success.length > 0 ?
		// 		<div className="alert alert-success alert-dismissible fade show" role="alert">{this.props.success}</div>
		// 	:
		// 		''
		// 	}
		// </div>
		)
	}
};

const mapStateToProps = (state, dispatch) => {
    return {
		data: state.messages.data,
		errors: state.messages.errors || [],
		success: state.messages.success || '',
		translations: state.lang

    }
};

export default connect(mapStateToProps, {logout})(MessagesContainer);
