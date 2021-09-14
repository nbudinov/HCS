import React, { Component } from 'react'
import { connect } from 'react-redux';
import { copyMenu } from './../../actions/places.actions';
import MessagesContainer from './../../../messages/MessagesContainer';
import Select from 'react-select'
import Auth from './../../../../utils/Auth';

class CopyMenuTab extends Component {
    constructor(props) {
        super(props)

        this.state = {
            from_place_id: 0
        }
    }

    componentWillReceiveProps(nextProps) {

    
    }
    
	onChangeSelectAutocompletePlace = (valueLabel) => {
        this.setState({ from_place_id: valueLabel.value });
	}

    copyMenuBtn = () => {
        this.props.copyMenu(this.state.from_place_id);
    }

    render() {
        let autocompletePlaces = [];

        this.props.places.map(place => {
            let currPlace = Auth.getUserPlace();

            if(place.id != currPlace) {
                autocompletePlaces.push( {'value': place.id, 'label': place.name} );
            }
        });

        return (
            <form>

                <label className="col-md-12 col-form-label">{this.props.translations.places.copy_menu_from}</label>

                <Select name="parentId" options={autocompletePlaces} 
                    onChange={this.onChangeSelectAutocompletePlace} 
                    // placeholder={"Основна категория (родител)"}
                />
                <br />

                <button className="btn btn-primary" type="button" onClick={this.copyMenuBtn}>Copy menu</button>

                <br />
            </form>
        )    
    }
}




const mapStateToProps = (state, ownProps) => {

    return {
        places: state.places.places || [],
        translations: state.lang,

    }

};

export default connect(mapStateToProps, { copyMenu })(CopyMenuTab);