import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bulkAddTables } from '../../actions/tablesActions';
import AddEditTableForm from './AddEditTableForm';
import { NavLink } from 'react-router-dom';
import { ADMIN_URL, API_TOKEN } from '../../constants';
import { addErrorMessages } from './../messages/messages.actions';
import { withRouter } from 'react-router-dom';
import { SCAN_URL } from './../../constants';
import Utils from '../../utils/Utils';
import Auth from './../../utils/Auth';
import MessagesContainer from '../messages/MessagesContainer';
import Select from 'react-select'

// let md5 = require('md5');

class AddBulkTablesPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            table_num_start: '',
            table_num_end: '',
            active: 1,
            place_in_url: 0,
            prefix: '',
            currentDate: + new Date(),
            // tableOrdertypes: [],
            tableOrdertype: '',
            tableOrdertypeValue: ''
        }

    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value.replace(/[а-я]/i, "") })
    }

    onChangeCheckbox = (e) => {
        this.setState({ [e.target.name]: e.target.checked });
    }

    onChangeSelectAutocomplete = (fieldName, valueLabel) => {
        this.setState({ [fieldName]: valueLabel });
    }

    onFieldChange = (fieldName, value) => {
        this.setState({ [fieldName]: value });
    }

    validate() {
        let errors = [];

        if (this.state.table_num_start.length == 0) {
            errors.push(this.props.translations.messages.errors.invalid_table_num_start);
        }

        if (this.state.table_num_end.length == 0) {
            errors.push(this.props.translations.messages.errors.invalid_table_num_end);
        }

        if (this.state.tableOrdertypeValue.length == '') {
            errors.push(this.props.translations.messages.errors.invalid_ordertype);
        }

        return errors;
    }

    onSubmit = (e) => {
        const { places, clients } = this.props;
        e.preventDefault();

        const errors = this.validate();
        if (errors.length > 0) {
            this.props.addErrorMessages(errors);
            return;
        }

        let currClient = '';
        let currPlace = '';

        if (places) {
            currPlace = places.find(p => p.id == Auth.getUserPlace());

            if (currPlace && Object.values(currPlace).length > 0 && currPlace.clientId) {
                currClient = clients.find(c => c.id == currPlace.clientId)
            }
        }

        let currClientSlug = '';
        if (currClient && Object.keys(currClient).length > 0 && currClient.slug) {
            currClientSlug = currClient.slug;
        }



        // let ordertypeIds = this.state.tableOrdertypes.map(c => c.value);

        let { table_num_start, table_num_end } = this.state;

        let tableNums = [];
        for (let i = 0; i <= parseInt(table_num_end) - parseInt(table_num_start); i++) {
            tableNums.push({
                table_num: parseInt(table_num_start) + i,
                place_id: Auth.getUserPlace(),
                active: this.state.active,
                tableOrdertypes: [this.state.tableOrdertypeValue.value],
                place_in_url: this.state.place_in_url,
                prefix: this.state.prefix,
                place_url: this.state.place_in_url ? '/' + currClientSlug : '',
            });
        }
        // console.log('tableNums', tableNums)
        const post = tableNums;
        // const post = JSON.stringify(tableNums);
        // console.log('post', post)
        // var canvas = document.getElementById('table-qr-code');
        // let formData = new FormData()

        // if (canvas) {
        //     var img = canvas.toDataURL("image/png");

        //     if (img) {
        //         // Image append
        //         formData.append("file", img)
        //     }
        // }
        this.props.bulkAddTables(this.props.history, post, window.location.origin);
    }



    render() {

        let ordertypeOptions = [];

        Object.values(this.props.currPlaceOrderTypes).map(ordertype => {
            if (ordertype.active == 1) {
                ordertypeOptions.push({ 'value': ordertype.id, 'label': ordertype.type });
            }
        });

        // console.log('currOrderTypes', this.state.currOrderTypes)
        // console.log("--- ", Utils.generateTableToken(this.state.table_num))
        return (
            <main className="main">

                {/* <!-- Breadcrumb--> */}
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><NavLink to={ADMIN_URL}>{this.props.translations.common.dashboard}</NavLink></li>
                    {/* <li className="breadcrumb-item">Меню</li> */}
                    <li className="breadcrumb-item"><NavLink to={ADMIN_URL + "tables"}>{this.props.translations.tables.title}</NavLink></li>
                    <li className="breadcrumb-item active">{this.props.translations.tables.add}</li>
                    {/* <!-- Breadcrumb Menu--> */}
                    <li className="breadcrumb-menu d-md-down-none">
                        <div className="btn-group" role="group" aria-label="Button group">
                            {/* 
                            <!--<a className="btn" href="./">
                                <i className="icon-graph"></i>  Dashboard</a>
                            <a className="btn" href="#">
                                <i className="icon-settings"></i>  Settings</a>
                            --> 
                            */}
                        </div>
                    </li>
                </ol>

                <div className="container-fluid">
                    <div className="animated fadeIn">
                        <div className="row">

                            {/* <!-- /.col--> */}
                            <div className="col-sm-12">
                                <div className="card">
                                    {/* 
									<AddEditTableForm
										onSubmit={this.onSubmit}
										onChange={this.onChange}
										onChangeCheckbox={this.onChangeCheckbox}
										// onChangeSelectAutocomplete={this.onChangeSelectAutocomplete}
										onFieldChange={this.onFieldChange}

										table={this.state}
										tableNum={this.state.table_num}
										tableActive={this.state.active}
										currentDate={this.state.currentDate}
										actionText="Добави"
										isAddingTable="1"
										nameError={this.props.errors.find(error => error.path == 'table_num') ? this.props.errors.find(error => error.path == 'table_num') : ""}
										translations={this.props.translations}
										currPlaceOrderTypes={this.props.currPlaceOrderTypes}
										tableOrdertypeValue={this.state.tableOrdertypeValue}

									/> */}



                                    {/*  */}

                                    <div className="card-body">
                                        <MessagesContainer />

                                        <div className="row">
                                            <div className="col-sm-12 col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="name">{this.props.translations.common.number_start}</label>
                                                    <input className={`form-control `} id="name" type="text" placeholder={this.props.translations.common.number_start} name="table_num_start" onChange={this.onChange} value={this.state.table_num_start} />
                                                    {/* <div className="invalid-feedback">{this.props.errors.find(error => error.path == 'table_num').message ? this.props.errors.find(error => error.path == 'table_num').message : this.props.errors.find(error => error.path == 'table_num')}</div> */}
                                                </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="name">{this.props.translations.common.number_end}</label>
                                                    <input className={`form-control `} id="name" type="text" placeholder={this.props.translations.common.number_end} name="table_num_end" onChange={this.onChange} value={this.state.table_num_end} />
                                                    {/* <div className="invalid-feedback">{this.props.errors.find(error => error.path == 'table_num').message ? this.props.errors.find(error => error.path == 'table_num').message : this.props.errors.find(error => error.path == 'table_num')}</div> */}
                                                </div>
                                            </div>
                                        </div>

                                        {/* {(this.state.table_num != '') ?
                                            <QRCode
                                                id="table-qr-code"
                                                value={tableToken}
                                                size={250}
                                                level={"H"}
                                                includeMargin={true}
                                            // style={{display: 'none'}}
                                            />
                                            : null} */}

                                        {/* {generateQRbtn} */}

                                        {/* <input type="hidden" name="table_token" value={tableToken} onChange={this.onChange}/> */}
                                        {/* name="table_num" onChange={this.onChange} value={this.state.table_num} */}

                                        {/* {(this.state.table_num != '' && props.isAddingTable == 0) ?
                                            <a onClick={props.downloadQr} className="btn btn-default"> Download QR </a>


                                            // <React.Fragment>
                                            //     <br/>
                                            //     <img src={TABLE_QR_CODE_IMAGE_PATH + props.qrCodeImage}/>
                                            //     <a href={TABLE_QR_CODE_IMAGE_PATH + props.qrCodeImage} target="_blank">{this.props.translations.common.download}
                                            //     </a>
                                            //     <br/>
                                            //     <br/>
                                            // </React.Fragment>
                                            : ''
                                        } */}




                                        <div className="row">
                                            <div className="form-group col-sm-12 col-md-6">
                                                <label htmlFor="catHierarchyId">{this.props.translations.common.order_type}</label>

                                                {/* <Select name="parentId" options={autocompleteCats} 
                            onChange={this.onChangeSelectAutocompleteCategory} 
                            value={selectedParent} 
                            placeholder={"Основна категория (родител)"}
                        /> */}


                                                <Select
                                                    value={this.state.tableOrdertypeValue ? this.state.tableOrdertypeValue : this.state.tableOrdertype}
                                                    // isMulti
                                                    name="colors"
                                                    options={ordertypeOptions}
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    onChange={(valueLabel) => this.onFieldChange('tableOrdertypeValue', valueLabel)}
                                                // onChange={(values, { action, removedValue }) => props.ingredientsOnChange(values, { action, removedValue }, 'removable')}
                                                />
                                            </div>

                                            <div className="col-sm-12 col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="name">{this.props.translations.common.prefix}</label>
                                                    <input className={`form-control `} id="prefix" type="text" placeholder={this.props.translations.common.prefix} name="prefix" onChange={this.onChange} title={"latin"} value={this.state.prefix} />
                                                    {/* <div className="invalid-feedback">{this.props.errors.find(error => error.path == 'table_num').message ? this.props.errors.find(error => error.path == 'table_num').message : this.props.errors.find(error => error.path == 'table_num')}</div> */}
                                                </div>
                                            </div>


                                        </div>

                                        <div className=" row">
                                            <label className="col-md-1 col-form-label">{this.props.translations.common.active}</label>
                                            <div className="col-md-11 col-form-label">
                                                <label className="switch switch-label switch-pill switch-outline-primary-alt">
                                                    <input className="switch-input" type="checkbox" name="active" onChange={this.onChangeCheckbox} checked={this.state.active} title={"latin"} />
                                                    <span className="switch-slider" data-checked={this.props.translations.common.yes} data-unchecked={this.props.translations.common.no}></span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className=" row">
                                            <label className="col-md-1 col-form-label">{this.props.translations.common.place_in_url}</label>
                                            <div className="col-md-11 col-form-label">
                                                <label className="switch switch-label switch-pill switch-outline-primary-alt">
                                                    <input className="switch-input" type="checkbox" name="place_in_url" onChange={this.onChangeCheckbox} checked={this.state.place_in_url} title={"latin"} />
                                                    <span className="switch-slider" data-checked={this.props.translations.common.yes} data-unchecked={this.props.translations.common.no}></span>
                                                </label>
                                            </div>
                                        </div>






                                        <hr />
                                        <br />

                                        <div className="form-actions">
                                            {/* {props.isAddingTable == '1' ? '' : <button className="btn btn-danger mright10" type="button" data-toggle="modal" data-target={"#dangerModal" + props.tableId} > {this.props.translations.common.delete}</button>}

                                            <DeleteTableModal
                                                tableId={props.tableId}
                                                tableNum={this.state.table_num}
                                                deleteTable={props.deleteTable}
                                                translations={props.translations}
                                            /> */}

                                            <NavLink to={ADMIN_URL + 'tables'}>
                                                <button className="btn btn-secondary" type="button">
                                                    {this.props.translations.common.cancel}
                                                </button>
                                            </NavLink>

                                            <button className="fright btn btn-primary" type="submit" onClick={this.onSubmit}>
                                                {this.props.translations.common.add}
                                            </button>

                                        </div>

                                    </div>


                                    {/*  */}

                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </main>
        )
    }
}

const mapStateToProps = state => {


    let orderTypes = [];

    if (state.places.places) {
        let currPlace = state.places.places.find(p => p.id == Auth.getUserPlace());
        if (currPlace) {
            orderTypes = currPlace.ordertypes;
        }
    }

    return {
        currPlaceOrderTypes: orderTypes,
        errors: state.tables.errors,
        translations: state.lang,
        clients: state.clients.clients,
        places: state.places.places,
    }
};

// const mapDispatchToProps = (dispatch, ownProps) => {
// 	return {
// 		addTable: (data, imageData) => dispatch(addTable(ownProps.history, data, imageData)),
// 		addErrorMessages: (msgs) => dispatch(addErrorMessages(msgs))
// 	}
// }

export default withRouter(connect(mapStateToProps, { bulkAddTables, addErrorMessages })(AddBulkTablesPage));