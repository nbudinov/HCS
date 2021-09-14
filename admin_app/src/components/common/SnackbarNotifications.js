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
    // const [snackPack, setSnackPack] = React.useState([]);
    // const [open, setOpen] = React.useState(false);
    // const [messageInfo, setMessageInfo] = React.useState(undefined);

    // console.log(`props`, props)
    // // React.useEffect(() => {
    // console.log(`props.snackbarText`, props.snackbarText)
    // if (!messageInfo && !open && props.snackbarText) {
    //     setMessageInfo(props.snackbarText)
    //     setOpen(true);
    // }
    // // })

    // React.useEffect(() => {


    //     if (snackPack.length && !messageInfo) {
    //         // Set a new snack when we don't have an active one
    //         setMessageInfo({ ...snackPack[0] });
    //         setSnackPack((prev) => prev.slice(1));
    //         setOpen(true);
    //     } else if (snackPack.length && messageInfo && open) {
    //         // Close an active snack when a new one is added
    //         setOpen(false);
    //     }
    // }, [snackPack, messageInfo, open]);

    // const handleClick = (message) => () => {
    //     setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
    // };

    // const handleClose = (event, reason) => {
    //     if (reason === 'clickaway') {
    //         return;
    //     }
    //     setOpen(false);
    //     setMessageInfo(undefined);

    // };

    // const handleExited = () => {
    //     setMessageInfo(undefined);
    //     setOpen(false);
    // };

    const transitionComponent = (props) => <Slide {...props} direction="down" />;

    const classes = useStyles();
    return (
        <div>
            {/* <Button onClick={handleClick('Message A')}>Show message A</Button>
            <Button onClick={handleClick('Message B')}>Show message B</Button> */}

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
