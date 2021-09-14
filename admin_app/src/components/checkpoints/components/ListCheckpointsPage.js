import React, { Component } from 'react'
import { connect } from 'react-redux';
import { listCheckpoints, addEditCheckpoint } from '../actions/checkpoints.actions';
import ListEachCheckpoint from './ListEachCheckpoint';
import Pagination from "react-js-pagination";
import { NavLink } from 'react-router-dom';
import { push } from 'react-router-redux';
import { ADMIN_URL, ITEMS_PER_PAGE, ITEMS_PAGE_RANGE_DISPLAYED, ADMIN_QR_CODE_DATA, SCAN_URL } from '../../../constants.js'
import { bindActionCreators } from 'redux'
import MessageContainer from './../../messages/MessagesContainer';
import ReactExport from "react-export-excel";
import Utils from './../../../utils/Utils';
import QRCodeStyling from "qr-code-styling";
import { openConfirmModal } from './../../../actions/adminActions';
import { addErrorMessages, addSuccessMessage } from './../../messages/messages.actions';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const checkpointQRCode = new QRCodeStyling(ADMIN_QR_CODE_DATA);

class ListCheckpointsPage extends Component {
    constructor(props) {
        super(props);
        // this.activeDefaultLanguage = 'bg'; // TODO add it in db
    }

    componentWillMount() {
        this.props.listCheckpoints();
    }

    deleteCheckpoint = (e, id) => {
        e.preventDefault();
        const post = {
			id: id,
			deleted: 1,
		}

		this.props.addEditCheckpoint(post)
		.then(resp => {
            this.props.listCheckpoints();
			this.props.addSuccessMessage("Успешно изтрихте локация")
		})
		.catch(error => {
			this.props.addErrorMessages(error.response.data.error.errors);
		})
    }

    handlePageChange = (page) => {
        this.props.dispatch(push('/admin/checkpoints?page=' + page))
    }

    onChangeCheckboxIsForReservation = (e, id) => {
        const post = {
            id: id,
            is_for_reservation: e.target.checked,
        }
        this.props.editCheckpoint(id, post);
    }

    downloadAll = async () => {
        const timer = ms => new Promise(res => setTimeout(res, ms))

        for (let i = 0; i < Object.keys(this.props.checkpoints).length; i++) {
            await timer(500); // then the created Promise can be awaited

            checkpointQRCode.update({
                data: SCAN_URL + Object.values(this.props.checkpoints)[i].token
            });

            checkpointQRCode.download({
                extension: 'png',
                name: Object.values(this.props.checkpoints)[i].name
            });
        }

    }

    render() {
        let checkpointsList = this.props.checkpoints;

        const items_count = Object.keys(checkpointsList).length
        const current_page = this.props.page;
        const start_offset = (current_page - 1) * ITEMS_PER_PAGE;
        let start_count = 0;

        // console.log('items_count', items_count)
        // console.log('current_page', current_page)
        // console.log('start_offset', start_offset)
        // console.log('checkpointsList', checkpointsList)

        // return (
        // )
        // console.log('this.props.checkpoints', this.props.checkpoints)

        let exportDataSet = []
        Object.values(this.props.checkpoints).map(t =>
            exportDataSet.push({ url: t.url, checkpoint_num: t.checkpoint_num })
        )


        // console.log('exportDataSet', exportDataSet)
        return (
            <main className="main">

                {/* <!-- Breadcrumb--> */}
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><NavLink to={ADMIN_URL}>{this.props.translations.common.dashboard}</NavLink></li>
                    <li className="breadcrumb-item active">{this.props.translations.checkpoints.title}</li>
                    <li className="breadcrumb-menu d-md-down-none">
                        <div className="btn-group" role="group" aria-label="Button group">
                            <button className="btn" type="button" onClick={() =>
                                this.props.openConfirmModal("WARNING: This will download all QR codes as images. Are you sure you want to continue? / We advise you to edit the browser settings and allow autosave / ВНИМАНИЕ: Това действие ще свали множество файлове - всички QR кодове на масите. Сигурни ли сте че искате да продължите ? Ако да, ви съветваме първо да промените настройките на браузъра и да позволите автоматично сваляне! ",
                                    () => this.downloadAll(),
                                    () => void (0))}>
                                <i className="fas fa-download"></i> &nbsp; {this.props.translations.common.download}
                            </button>
                            {/* {Utils.hasFunctionalityModule('reservations') ?
                                <NavLink to={ADMIN_URL + `checkpointGroups`} className="btn" >
                                    <i className="nav-icon icon-settings"></i> &nbsp; {this.props.translations.checkpoint_groups.title}
                                </NavLink>
                                :
                                null
                            } */}
                            <NavLink to={ADMIN_URL + `checkpoints/add`} className="btn" >
                                <i className="fas fa-plus"></i> &nbsp; {this.props.translations.checkpoints.add}
                            </NavLink>
                            {/* <NavLink to={ADMIN_URL + `checkpoints/add-bulk`} className="btn" >
                                <i className="fas fa-plus"></i> &nbsp; {this.props.translations.common.add_bulk}
                            </NavLink> */}



                            {/* 
                            <!--<a className="btn" href="./">
                                <i className="icon-graph"></i>  Dashboard</a>
                            <a className="btn" href="#">
                                <i className="icon-settings"></i>  Settings</a>
                            --> 
                            */}

                            {/* <ExcelFile element={<button type="button" className="btn btn-primary" style={{ color: 'black' }}>Export</button>}>
                                <ExcelSheet data={exportDataSet} name="Data">
                                    <ExcelColumn label="Url" value="url" />
                                    <ExcelColumn label="Checkpoint number" value="checkpoint_num" />
                                </ExcelSheet>
                            </ExcelFile> */}

                        </div>
                    </li>
                </ol>


                <div className="container-fluid">
                    <div className="animated fadeIn">
                        <div className="row">

                            {/* <!-- /.col--> */}
                            <div className="col-lg-12">
                                <div className="card">

                                    <MessageContainer />

                                    <div className="card-body">
                                        <table className="table table-responsive-sm table-striped">
                                            <thead>
                                                <tr>
                                                    <th>{this.props.translations.common.name}</th>
                                                    {/* <th>{this.props.translations.common.link}</th> */}
                                                    <th>{this.props.translations.common.action}</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {Object.values(checkpointsList).map((checkpoint, index) => {
                                                    if (index >= start_offset && start_count < ITEMS_PER_PAGE) {
                                                        start_count++;

                                                        return <ListEachCheckpoint
                                                            key={checkpoint.id}
                                                            checkpoint={checkpoint}
                                                            deleteCheckpoint={this.deleteCheckpoint}
                                                            translations={this.props.translations}
                                                            onChangeCheckboxIsForReservation={this.onChangeCheckboxIsForReservation}
                                                        // activeDefaultLanguage={this.activeDefaultLanguage}
                                                        />
                                                    }
                                                })}

                                            </tbody>
                                        </table>

                                        <Pagination
                                            className="pagination"
                                            itemClass="page-item"
                                            activePage={current_page}
                                            activeClass="active"
                                            linkClass="page-link"
                                            prevPageText="<"
                                            nextPageText=">"
                                            firstPageText="<<"
                                            lastPageText=">>"
                                            itemsCountPerPage={ITEMS_PER_PAGE}
                                            totalItemsCount={items_count}
                                            pageRangeDisplayed={ITEMS_PAGE_RANGE_DISPLAYED}
                                            onChange={this.handlePageChange}
                                        />

                                        {/* <ul className="pagination">
                                            <li className="page-item">
                                                <a className="page-link" href="#">Prev</a>
                                            </li>
                                            <li className="page-item active">
                                                <a className="page-link" href="#">1</a>
                                            </li>
                                            <li className="page-item">
                                                <a className="page-link" href="#">2</a>
                                            </li>
                                            <li className="page-item">
                                                <a className="page-link" href="#">3</a>
                                            </li>
                                            <li className="page-item">
                                                <a className="page-link" href="#">4</a>
                                            </li>
                                            <li className="page-item">
                                                <a className="page-link" href="#">Next</a>
                                            </li>
                                        </ul> */}
                                    </div>
                                </div>
                            </div>
                            {/* <!-- /.col--> */}
                        </div>
                    </div>
                </div>
            </main >
        )
    }
}

const mapStateToProps = state => ({
    checkpoints: state.checkpoints.checkpoints,
    page: Number(state.router.location.query.page) || 1,
    translations: state.lang
});

const mapDispatchToProps = (dispatch, props) => {
    return {
        dispatch,
        ...bindActionCreators({ listCheckpoints, addEditCheckpoint, openConfirmModal, addErrorMessages, addSuccessMessage }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListCheckpointsPage);
