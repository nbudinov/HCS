import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import { ADMIN_URL, PRODUCT_IMG_URL } from '../../../constants.js'
import DeleteModal from '../../common/DeleteModal';
import MessagesContainer from '../../messages/MessagesContainer';
import Utils from '../../../utils/Utils.js';
import LangDropdown from './../../common/LangDropdown';
import Select from 'react-select'

class AddEditPlaceForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uploadedImgName: ""
        }
    }

    addUploadedFileText = e => {
        if (e && e.target && e.target.files && e.target.files[0] && e.target.files[0].name) {
            this.setState({ uploadedImgName: e.target.files[0].name })
        }
    }

    render() {
        const props = this.props;

        let selectedParent;
        let autocompleteItems = [];
        autocompleteItems.push({ 'value': null, 'label': "Choose client" })

        console.log("AUTO ", props.place)
        props.clients.map(cl => {
            if (props.place.clientId == cl.id) {
                selectedParent = { 'value': cl.id, 'label': cl.name };
            }

            // if(cat.active == 1) {

            autocompleteItems.push({ 'value': cl.id, 'label': cl.name });
            // } 
        });


        let selectedCity;
        let cityOptions = [];
        cityOptions.push({ 'value': null, 'label': "Choose city" })

        props.cities.map(city => {
            if (props.place.cityId == city.id) {
                selectedCity = { 'value': city.id, 'label': city.name };
            }

            cityOptions.push({ 'value': city.id, 'label': city.name });
        });

        let tagsOptions = [];

        props.tags.map(tag => {
            tagsOptions.push({ 'value': tag.id, 'label': tag.name });
        });

        let editImage;
        if (props.isAdding == '0' && (props.place.image && props.place.image.length > 0)) {
            editImage = <img src={Utils.getPlaceImagePath(props.place.image)} className="editPagesImage" />
        }

        return (
            <form onSubmit={props.onSubmit}>
                <MessagesContainer />
                <div className="card-body">

                    <LangDropdown
                        isDisabled={props.isAdding == 1 ? 1 : ""}
                        currLangOnChange={props.currLangOnChange}
                        currLang={props.currLang}
                        languages={props.languages}
                    />

                    <div className="row">
                        <div className="form-group col-sm-12">
                            <label htmlFor="parentId">{props.translations.common.client}</label>
                            <Select name="parentId" options={autocompleteItems} onChange={props.onChangeSelectAutocompleteItems} value={selectedParent}
                                placeholder={"Client"}
                            />
                        </div>

                        <div className="col-md-6 col-sm-12">
                            <div className="form-group">
                                <label htmlFor="name">{props.translations.invoices.name}</label>
                                <input className={`form-control`} id="name" type="text" placeholder={props.translations.common.name} name="name" onChange={props.onChange} value={props.place.name} />
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <div className="form-group">
                                <label htmlFor="short_name">{props.translations.invoices.short_name}</label>
                                <input className={`form-control`} id="short_name" type="text" placeholder={props.translations.common.short_name} name="short_name" onChange={props.onChange} value={props.place.short_name} />
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-12">
                            <div className="form-group">
                                <label htmlFor="company_name">{props.translations.invoices.company_name}</label>
                                <input className={`form-control`} type="text" placeholder={props.translations.places.company_name} name="company_name" onChange={props.onChange} value={props.place.company_name} />
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <div className="form-group">
                                <label htmlFor="company_name">{props.translations.invoices.company_eik}</label>
                                <input className={`form-control`} type="text" placeholder={props.translations.places.company_eik} name="company_eik" onChange={props.onChange} value={props.place.company_eik} />
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-12">
                            <div className="form-group">
                                <label htmlFor="company_city">{props.translations.invoices.company_city}</label>
                                <input className={`form-control`} type="text" name="company_city" onChange={props.onChange} value={props.place.company_city} />
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <div className="form-group">
                                <label htmlFor="company_address">{props.translations.invoices.company_address}</label>
                                <input className={`form-control`} type="text" name="company_address" onChange={props.onChange} value={props.place.company_address} />
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <div className="form-group">
                                <label htmlFor="company_person">{props.translations.invoices.company_person}</label>
                                <input className={`form-control`} type="text" name="company_person" onChange={props.onChange} value={props.place.company_person} />
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <div className="form-group">
                                <label htmlFor="company_email">{props.translations.places.company_email}</label>
                                <input className={`form-control`} type="text" name="company_email" onChange={props.onChange} value={props.place.company_email} />
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <div className="form-group">
                                <label htmlFor="monthly_fee">{props.translations.invoices.price}</label>
                                <input className={`form-control`} type="text" name="monthly_fee" onChange={props.onChange} value={props.place.monthly_fee} />
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-12">
                            <div className="form-group">
                                <label htmlFor="company_vat_registered">{props.translations.invoices.company_vat_registered}</label>

                                <label className="switch switch-label switch-pill switch-outline-primary-alt">
                                    <input className="switch-input" type="checkbox" name="company_vat_registered" onChange={props.onChangeCheckbox} checked={props.place.company_vat_registered} />
                                    <span className="switch-slider" data-checked={props.translations.common.yes} data-unchecked={props.translations.common.no}></span>
                                </label>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-12">
                            <label>{props.translations.common.is_paying}</label>

                            <label className="switch switch-label switch-pill switch-outline-primary-alt">
                                <input className="switch-input" type="checkbox" name="is_paying" onChange={props.onChangeCheckbox} checked={props.place.is_paying} />
                                <span className="switch-slider" data-checked={props.translations.common.yes} data-unchecked={props.translations.common.no}></span>
                            </label>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor="additional_info">{props.translations.places.additional_info}</label>
                                <textarea className={`form-control`} name="additional_info" onChange={props.onChange} value={props.place.additional_info}>
                                </textarea>
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6">
                            <div className="form-group">
                                <label htmlFor="lat">{props.translations.places.lat}</label>
                                <input className={`form-control`} type="text" name="lat" onChange={props.onChange} value={props.place.lat} />
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6">
                            <div className="form-group">
                                <label htmlFor="lng">{props.translations.places.lng}</label>
                                <input className={`form-control`} type="text" name="lng" onChange={props.onChange} value={props.place.lng} />
                            </div>
                        </div>

                        <div className="form-group col-sm-6">
                            <label htmlFor="parentId">{props.translations.places.city}</label>
                            <Select name="cityId" options={cityOptions} onChange={(valueLabel) => props.onChangeSelectAutocomplete('cityId', valueLabel)} value={selectedCity}
                                placeholder={"City"}
                            />
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="form-group">
                                <label htmlFor="visible_on_map">{props.translations.places.visible_on_map}</label>

                                <label className="switch switch-label switch-pill switch-outline-primary-alt">
                                    <input className="switch-input" type="checkbox" name="visible_on_map" onChange={props.onChangeCheckbox} checked={props.place.visible_on_map} />
                                    <span className="switch-slider" data-checked={props.translations.common.yes} data-unchecked={props.translations.common.no}></span>
                                </label>
                            </div>
                        </div>

                        <div className="form-group col-sm-12">
                            <label htmlFor="catHierarchyId">{props.translations.places.tags}</label>

                            <Select
                                value={props.place.tags}
                                isMulti
                                name="colors"
                                options={tagsOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={(v) => props.onChangeSelectAutocompleteMulti('tags', v)}
                            // onChange={(values, { action, removedValue }) => props.ingredientsOnChange(values, { action, removedValue }, 'removable')}
                            />
                        </div>

                        <div className="form-group col-sm-12">
                            <label className="col-md-1 col-form-label vertical-center" htmlFor="file-multiple-input">{props.translations.common.image}</label>
                            <div className="col-md-5 col-form-label vertical-center" style={{ justifyContent: 'center' }}>
                                {/* <input id="file-multiple-input" type="file" name="file-multiple-inpuproductisLiquidt" multiple=""/> */}
                                <input type='file' name='file' id='placeImg' multiple ref="image" style={{ display: 'none' }} onChange={this.addUploadedFileText} />
                                <label for="placeImg" type="button" className="btn btn-secondary" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, margin: 0 }}>{!props.isAdding && props.place.image && props.place.image.length > 0 ? props.translations.products.replace_image : props.translations.products.upload_image}</label>
                                {editImage}
                                {this.state.uploadedImgName}

                                {/* {!props.isAdding && props.productImage && props.productImage.length > 0 ?
                                    <button type="button" className="btn btn-danger" onClick={props.removeImage} style={{ borderTopRightRadius: 0, borderTopLeftRadius: 0 }}>{props.translations.products.delete_image}</button>
                                    :
                                    null
                                } */}
                            </div>
                        </div>

                    </div>

                    <hr />
                    <br />

                    <div className="form-actions">
                        {props.isAdding == '1' ? '' : <button className="btn btn-danger mright10" type="button" data-toggle="modal" data-target={"#dangerModal" + props.place.id} >{props.translations.common.delete}</button>}

                        <DeleteModal
                            id={props.place.id}
                            title={props.place.name}
                            deleteFunc={props.deletePlace}
                            translations={props.translations}
                        />

                        <NavLink to={ADMIN_URL + 'places'}>
                            <button className="btn btn-secondary" type="button">
                                {props.translations.common.cancel}
                            </button>
                        </NavLink>

                        <button className="fright btn btn-primary" type="submit">
                            {props.isAdding == '1' ? props.translations.common.add : props.translations.common.save}
                            {/* {props.actionText} */}
                        </button>

                    </div>

                </div>

            </form>
        )
    }
}

export default AddEditPlaceForm;