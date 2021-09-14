import React, {Component} from 'react';
import { connect } from 'react-redux';

class LoadingScreen extends Component {
	render() {
		return (
            <React.Fragment>
            {/* {this.props.isLoading ?  */}
                {/* <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                </div> */}

                <div className="loader-page-container" style={{display: this.props.isLoading ? 'block':'none'}}></div>
                <div className="loader loader-page" style={{visibility: this.props.isLoading ? 'visible' : 'hidden'}}></div>


                {/* <div >

                </div>
                <div className="loader" style={{ display: 'inline-block', verticalAlign: 'text-bottom', visibility: 'visible' }}></div> */}
            {/* : */}
                {/* null */}
            {/* } */}
            </React.Fragment>
           
        )
	}
};

const mapStateToProps = (state, dispatch) => {
    return {
		isLoading: state.loading.isLoading || false,
    }
};

export default connect(mapStateToProps, {})(LoadingScreen);
