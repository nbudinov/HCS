import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from '@material-ui/styles';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import Fade from '@material-ui/core/Fade';
import QrReader from "react-qr-reader";
import { Dialog, Grow } from "@material-ui/core";
import moment from "moment";

class VisitDetailsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
    }

    render() {
        return (
                <Dialog
                    fullWidth={true}
                    maxWidth={'xs'}
                    open={this.props.isOpened}
                    // open={1}
                    onClose={this.props.onClose}
                    aria-labelledby="max-width-dialog-title"
                    TransitionComponent={Grow}
                    // className={classes.modal}
                    data-class="dialog-container"
                >
                        <Fade in={true} timeout={{ enter: 385, exit: 190 }}>
                            <DialogContent style={{ margin: 0 }}>

                                <div className="row">
                                    <div className="col-md-12 text-center">
                                        <h4>Детайли:</h4>
                                        <hr/>
                                    </div>
                                    <div className="col-md-6">
                                        <b>Задача:</b>
                                    </div>
                                    <div className="col-md-6">
                                        {this.props.task.name}
                                    </div>
                                    <div className="col-md-6">
                                        <b>Потребител:</b>
                                    </div>
                                    <div className="col-md-6">
                                        {this.props.user.email}
                                    </div>
                                    
                                    <div className="col-md-12">
                                        <hr/>
                                    </div>
                                    {this.props.user.visits && this.props.user.visits.map(v => (
                                        <>
                                            <div className="col-md-12">
                                                <h4 style={{marginTop: 10}}>Посещение</h4>
                                            </div>

                                            <div className="col-md-3">
                                                <b>Време:</b>
                                            </div>
                                            <div className="col-md-9">
                                                {moment(v.createdAt).format('YYYY-MM-DD HH:mm')}
                                            </div>
                                            <div className="col-md-3">
                                                <b>Коментар:</b>
                                            </div>
                                            <div className="col-md-9">
                                                {v.comment || "-"}
                                            </div>
                                        </>
                                    ))}

                                </div>



                                {/* <div style={{margin: 10}}>
                                    <textarea name="visitComment" className="form-control" onChange={this.props.onChange} placeholder="Коментар към задачата">
                                        {this.props.visitComment}
                                    </textarea>
                                </div>
                                
                                <div style={{textAlign: "center", margin: 10}}>
                                    <button className="btn btn-primary " type="submit" onClick={() => this.props.onSubmitComment()}>
                                        Продължи
                                    </button>
                                </div> */}

                            </DialogContent>
                        </Fade>
                </Dialog>

        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        translations: state.lang.translations,
    };
};

export default withStyles()(connect(mapStateToProps, {  })(VisitDetailsModal));