import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { closeConfirmModal } from './../../actions/adminActions';


class ConfirmModal extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.openConfirmModal}
                    onClose={() => { this.props.confirmModalCallbackFail(); this.props.closeConfirmModal() }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    {/* <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle> */}
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {this.props.confirmModalText}
                            {/* Let Google help apps determine location. This means sending anonymous location data to
                            Google, even when no apps are running. */}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { this.props.confirmModalCallbackFail(); this.props.closeConfirmModal() }} color="primary">
                            Не
                        </Button>
                        <Button onClick={() => { this.props.confirmModalCallbackSuccess(); this.props.closeConfirmModal() }} color="primary" autoFocus>
                            Да
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = (state, dispatch) => {
    return {
        openConfirmModal: state.admin.openConfirmModal || false,
        confirmModalText: state.admin.confirmModalText || '',
        confirmModalCallbackSuccess: state.admin.confirmModalCallbackSuccess || void (0),
        confirmModalCallbackFail: state.admin.confirmModalCallbackFail || void (0),
    }
};

export default connect(mapStateToProps, { closeConfirmModal })(ConfirmModal);

