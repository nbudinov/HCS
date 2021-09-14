import React, { Component, createRef } from 'react'
import { NavLink } from 'react-router-dom';
import { ADMIN_URL } from '../../../constants.js'
import DeleteCheckpointModal from './../../common/DeleteModal';
import QRCode from 'qrcode.react';
import { Link } from 'react-router-dom';
import MessagesContainer from './../../messages/MessagesContainer';
import { SCAN_URL } from './../../../constants';
import Utils from './../../../utils/Utils';
import Select from 'react-select'
// import QRCodeStyling from "qr-code-styling";
// import tablLogo from './../../images/tabl-transparent.png';
// import tablLogoWhite from './../../images/tabl-transparent-white.png';

// let md5 = require('md5');

// const qrCd = new QRCodeStyling({
//     width: 350,
//     height: 350,
//     // data: 'https://tabl.bg/img/tabl-transparent.png',
//     // image: tablLogo,
//     image: tablLogoWhite,
//     cornersDotOptions: {
//         color: "#f66201"
//     },
//     dotsOptions: {
//         //color: "#4267b2",
//         type: "square"
//         //'rounded' 'dots' 'classy' 'classy-rounded' 'square' 'extra-rounded'
//     },
//     imageOptions: {
//         crossOrigin: "anonymous",
//         // margin: 20
//     }
// });

class AddEditCheckpointForm extends Component {
    constructor(props) {
        super(props)
        this.ref = React.createRef();

    }

    componentDidMount() {
        if (this.props.isAdding == 0) {
            this.props.checkpointQRCode.append(this.ref.current);
        }
    }

    componentWillReceiveProps(){
        if (this.props.isAdding == 0) {
            this.props.checkpointQRCode.append(this.ref.current);
        }
    }

    render() {
        const props = this.props;
        //     const downloadQR = () => { // will implement soon}
        // <div>

        //   <a onClick={downloadQR}> Download QR </a>
        // </div>
        // console.log(md5('message'));

        // let checkpointToken = md5(md5(props.checkpointNum));
        let checkpointToken = "";
        if (props.isAdding == 0) {
            checkpointToken = SCAN_URL + props.checkpoint.token;
            this.props.checkpointQRCode.update({
                data: checkpointToken
            });

            console.log("UPDATING ", checkpointToken, props.token)
        }
        // qrCd.data = checkpointToken;
        // if (this.props.isAdding == 0) {
        //     this.props.checkpointQRCode.update({
        //         data: token
        //     });
        // }

        let generateQRbtn = props.isAdding == 0 ?
            (
                <button className="btn btn-default" onClick={props.generateNewQrCode}>{props.translations.checkpoints.generate_qr}</button>
            )
            : null

        // const onDownloadClick = (e) => {
        //     e.preventDefault()
        //     qrCd.download({
        //         extension: 'png'
        //     });
        // };

        console.log("ADD ", props)

        return (

            <form>
                <div className="card-body">
                    <MessagesContainer />

                    {/* <div ref={ref} /> */}

                    {/* <qrCd /> */}

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor="name">{props.translations.common.name}</label>
                                <input className={`form-control`} id="name" type="text" title={"latin"} placeholder={props.translations.common.name} name="name" onChange={props.onChange} value={props.checkpoint.name} />
                            </div>
                        </div>
                    </div>
                    {(props.token != '') ?
                        <>
                            <div
                                id="checkpoint-qr-code2"
                                ref={this.ref}
                            />
                            {/* <QRCode
                                id="checkpoint-qr-code"
                                value={checkpointToken}
                                size={250}
                                level={"H"}
                                includeMargin={true}
                            // style={{display: 'none'}}
                            /> */}
                        </>
                        :
                        null
                    }
                    
                    {generateQRbtn}


                    {(props.checkpointNum != '' && props.isAdding == 0) ?
                        <a onClick={props.downloadQr} className="btn btn-default"> Download QR </a>
                        // <button onClick={e => onDownloadClick(e)}>Download</button>
                        :
                        ''
                    }

                    <div className="row">
{/* 
                        <label className="col-md-1 col-form-label">{props.translations.common.active}</label>
                        <div className="col-md-11 col-form-label">
                            <label className="switch switch-label switch-pill switch-outline-primary-alt">
                                <input className="switch-input" type="checkbox" name="active" onChange={props.onChangeCheckbox} checked={props.checkpointActive} />
                                <span className="switch-slider" data-checked={props.translations.common.yes} data-unchecked={props.translations.common.no}></span>
                            </label>
                        </div> */}

                        {/* <label className="col-md-1 col-form-label">{props.translations.common.place_in_url}</label>
                        <div className="col-md-11 col-form-label">
                            <label className="switch switch-label switch-pill switch-outline-primary-alt">
                                <input className="switch-input" type="checkbox" name="place_in_url" onChange={props.onChangeCheckbox} checked={props.placeInUrl} disabled={props.isAdding == 0} />
                                < span className="switch-slider" data-checked={props.translations.common.yes} data-unchecked={props.translations.common.no}></span>
                            </label>
                        </div> */}

                        
                    </div>


                    <hr />
                    <br />

                    <div className="form-actions">
                        {props.isAdding == 1 ? '' : <button className="btn btn-danger mright10" type="button" data-toggle="modal" data-target={"#dangerModal" + props.checkpointId} > {props.translations.common.delete}</button>}

                        <DeleteCheckpointModal
                            checkpointId={props.checkpointId}
                            checkpointNum={props.checkpointNum}
                            deleteCheckpoint={props.deleteCheckpoint}
                            translations={props.translations}
                        />

                        <NavLink to={ADMIN_URL + 'checkpoints'}>
                            <button className="btn btn-secondary" type="button">
                                {props.translations.common.cancel}
                            </button>
                        </NavLink>

                        <button className="fright btn btn-primary" type="submit" onClick={props.onSubmit}>
                            {props.isAdding == 1 ? props.translations.common.add : props.translations.common.save}
                        </button>

                    </div>

                </div>

            </form>
        )
    }
}

export default AddEditCheckpointForm;