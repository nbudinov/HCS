import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from '@material-ui/styles';
import DialogContentText from '@material-ui/core/DialogContentText';
import Fade from '@material-ui/core/Fade';
import QrReader from "react-qr-reader";
import { styles } from './styles';
import { Dialog, Grow } from "@material-ui/core";

class CommentModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
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
                                <div style={{margin: 10}}>
                                    <textarea name="visitComment" className="form-control" onChange={this.props.onChange} placeholder="Коментар към задачата">
                                        {this.props.visitComment}
                                    </textarea>
                                </div>
                                
                                <div style={{textAlign: "center", margin: 10}}>
                                    <button className="btn btn-primary " type="submit" onClick={() => this.props.onSubmitComment()}>
                                        Продължи
                                    </button>
                                </div>

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

export default withStyles(styles)(connect(mapStateToProps, {  })(CommentModal));