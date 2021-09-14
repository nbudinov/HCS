import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from '@material-ui/styles';
import DialogContentText from '@material-ui/core/DialogContentText';
import Fade from '@material-ui/core/Fade';
import QrReader from "react-qr-reader";
import { styles } from './styles';
import { Dialog, Grow } from "@material-ui/core";

class ScanModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scanDelay: 500,
            scanLegacyMode: false,
        }
    }

    componentDidMount() {
    }

    getQrReader = () => {
        var scanner = "";

        scanner = <QrReader ref="qrReader1"
            delay={this.state.scanDelay}
            onError={this.props.handleScanError}
            onScan={this.props.handleScan}
            style={{ width: "100%" }}
        //legacyMode={scanLegacyMode}
        />

        return scanner;
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
                    <React.Fragment>
                        <Fade in={true} timeout={{ enter: 385, exit: 190 }}>
                            <DialogContentText style={{ margin: 0 }}>

                                {this.getQrReader()}

                            </DialogContentText>
                        </Fade>
                    </React.Fragment >
                </Dialog>

        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        translations: state.lang.translations,
    };
};

export default withStyles(styles)(connect(mapStateToProps, {  })(ScanModal));