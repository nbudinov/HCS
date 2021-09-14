import React, { Component } from 'react'
import { connect } from 'react-redux';
import { addRemoveOrdertype } from './../../actions/places.actions';

class OrderTypesTab extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    componentWillReceiveProps(nextProps) {

    
    }

    onChangeOrdertype = (checked, ordertype_id) => {
        this.props.addRemoveOrdertype(!checked, this.props.place.id, ordertype_id)
    }

    render() {

        return (
        
            <div className="col-sm-12 col-md-12" style={{width:1200}}>
                <div className="card">
                
                    <form>
                        <div className="card-body">

                            <div className=" row">
                                <label className="col-md-12 col-form-label">{this.props.translations.places.ordertypes}</label>

                                {Object.values(this.props.orderTypes).map(orderType => {
                                    let checked = this.props.place && this.props.place.ordertypes && 
                                        this.props.place.ordertypes.filter(t => t.id == orderType.id).length > 0 ? true : false
                                    return (
                                        <div className="col-md-4 col-sm-6 col-12 col col-form-label centered">
                                            <div>{orderType.type}</div>
                                            <label className="switch switch-label switch-pill switch-outline-primary-alt">

                                                <input className="switch-input" type="checkbox" name="active"
                                                    checked={checked}
                                                    onChange={() => this.onChangeOrdertype(checked, orderType.id)}
                                                />
                                                <span className="switch-slider" data-checked={this.props.translations.common.yes} data-unchecked={this.props.translations.common.no}></span>
                                            </label>
                                        </div>
                                    )
                                })
                                }

                            </div>

                            <br />

                        </div>

            </form>

                </div>
            </div>
        )    
        }
}




const mapStateToProps = (state, ownProps) => {

    return {
        orderTypes: state.places.ordertypes || []
        
    }

};

export default connect(mapStateToProps, { addRemoveOrdertype })(OrderTypesTab);