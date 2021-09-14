import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import { Close } from '@material-ui/icons';
import { Slide } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    close: {
        padding: theme.spacing(0.5),
    },
}));

export default function ConsecutiveSnackbars(props) {
    const transitionComponent = (props) => <Slide {...props} direction="down" />;

    const classes = useStyles();
    return (
        <div>
            <Snackbar
                // key={messageInfo ? messageInfo.key : undefined}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={props.snackbarText || false}
                autoHideDuration={10000} //10 sec
                onClose={() => props.setSnackbarText(false)}
                onExited={() => props.setSnackbarText(false)}
                message={props.snackbarText}
                // TransitionComponent={transitionComponent}
                action={
                    <React.Fragment>
                        <Button color="secondary" size="small" onClick={props.snackbarActionCallback}>
                            <b>{props.snackbarActionText}</b>
                        </Button>
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            // className={classes.close}
                            onClick={() => props.setSnackbarText(false)}
                        >
                            <Close />
                        </IconButton>
                    </React.Fragment>
                }
            />


        </div>
    );
}
