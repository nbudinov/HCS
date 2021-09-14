export
    const styles = theme => ({
        backdrop: {
            zIndex: 2,
            color: '#fff',
            position: 'absolute !important', //backdrop not on the full screen
        },
        modal: {
            '& .MuiPaper-root': {
                width: '100% !important',
            },
            '& .MuiDialogContent-root': {
                paddingTop: 5,
                paddingBottom: 0,
            }
        },
        modalTitle: {
            backgroundColor: "rgb(203,65,2)",
            zIndex: 1,
        },
        textFieldContainer: {
            display: 'block',
            margin: '15px 0',
            '&:nth-of-type(1)': {
                marginTop: 10,
            },
            '&:last-child': {
                marginBottom: 0,
            },
            '& .MuiFormLabel-root:not(.MuiInputLabel-root)': {
                fontWeight: 'bold'
            }
        },
        textField: {
            width: '100%',
            '& label.Mui-error': {
                color: 'rgba(0, 0, 0, 0.54)'
            },
            '& label.Mui-focused': {
                color: 'rgba(254, 105, 2, 0.7)',
            },
            '& .MuiInput-underline:after': {
                // borderBottomColor: 'rgb(254, 105, 2)',
                borderBottomColor: 'rgb(117 117 117)',
            },
            '& .MuiInput-underline.Mui-error:after': {
                borderBottomColor: '#f44336',
            },
        },
        promocodeAppliedSuccess: {
            '& .MuiInput-input': {
                fontWeight: 'bold',
                color: 'green'
            }
        },
        promocodeAppliedFail: {
            '& .MuiInput-input': {
                fontWeight: 'bold',
                color: 'red'
            }
        },

        errorContainer: {
            color: '#ff0c00f0',
            textAlign: 'center',
            fontWeight: 'bold',
            borderBottom: '1px solid #ff0c00f0',
            marginTop: 17,
            marginBottom: 5,
        },
        orderCheckbox: {
            margin: 0,
            color: 'rgb(254, 105, 2)',
            '&.Mui-checked': {
                color: 'rgb(254, 105, 2)',
            },
        },
        orderRadio: {
            margin: 0,
            color: 'rgb(254, 105, 2)',
            '&.Mui-checked': {
                color: 'rgb(254, 105, 2)',
            },
        },
        promoCodeBtn: {
            color: 'rgba(0, 0, 0, 0.54)',
            float: 'right',
            borderRadius: 0,
            padding: '10px 0',
            display: 'flex',
            '&:hover': {
                backgroundColor: 'transparent'
            }
        },
        applyPromoCodeBtn: {
            textAlign: 'center',
            width: '100%',
            borderRadius: 0,
            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
        },
        buttonsRow: {
            marginBottom: 0,
        },
        paymentMethodContainer: {
            marginTop: 30,
            marginBottom: '10px !important'
        },
        cutleryOptionContainer: {
            marginBottom: '10px !important'
        },
        orderLabel: {
            '&.Mui-focused': {
                // color: 'rgb(254, 105, 2, 0.7)',
                color: 'rgba(0, 0, 0, 0.54)',
            }
        },
        promoCodeRow: {
            marginTop: 10,
            marginBottom: 5,
            '@media screen and (max-width: 345px)': {
                marginTop: 25,
            }
        },
        preorderAddressContainer: {
            marginTop: 10,
        },
        preorderAddress: {
            marginTop: 5,
            borderRadius: 5,
            backgroundColor: '#e6e6e6',
            padding: '5px 11px',
            display: 'grid',
            'grid-template-columns': '70% 30%',
        },
        preorderAddressText: {
            placeSelf: 'center',
            textAlign: 'center',
            padding: 5,
        },
        preorderAddressNavigateBtn: {
            width: '100%',
            placeSelf: 'center',
            verticalAlign: 'bottom',
            borderLeft: '1px solid #ccc',
            textAlign: 'center',
        },
        preorderAddressNavigateIcon: {
            fontSize: 30,
            color: '#0064ac',
        },
        orderTimeOptionsContainer: {
            display: 'grid',
            gridTemplateColumns: '47% 47%',
            columnGap: '6%',
        },

        orderDisabledContainer: {
            background: 'gray',
            width: '95%',
            background: 'gray',
            margin: '0 auto',
            textAlign: 'center',
            marginTop: 20,
            // background: 'repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px)',
            backgroundColor: '#ff0c00f0',
            padding: 5,
            color: 'white',
            borderRadius: 5
        },
        isMultipleOptionsModalContainer: {
            margin: '40px 20px 45px 20px',
            display: 'grid',
            'grid-column-gap': 15,
            'grid-row-gap': 30,
            'grid-template-columns': '1fr 1fr',
            // 'grid-template-columns': '50% 50%',
            'place-self': 'center',
            textAlign: 'center',
            padding: 0,
            '@media screen and (max-width: 475px)': {
                'grid-template-columns': 'none',
                '& > *:first-child': {
                    marginBottom: 40,
                },
                margin: '20px 15px 25px 15px',
                'grid-row-gap': 20,
            }
        },
        // modalTypesBtnsBorderBottom: {
        //     'border-bottom': '1px solid #ff5200 !important',
        // },
        modalTypesBtns: {
            display: 'grid',
            // 'grid-column': '1 / 1',
            width: '100%',
            // height: '100%',
            // 'grid-template-rows': '50% 50%',
            'place-self': 'center',
            textAlign: 'center',
            color: '#575757',
            borderRadius: 0,
            borderBottom: '1px solid #ff7600',
            backgroundColor: '#f9f9f9',
            minWidth: 180,
            '@media screen and (max-width: 475px)': {
                minWidth: '80%',
            },

            'border': '1px solid #ebebeb',

            // 'border': '1px solid #ff5200',
            'border-top-right-radius': 7,
            'border-top-left-radius': 7,

            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            borderBottom: 'none',
        },
        typeText: {
            paddingLeft: 11,
            paddingRight: 11,
            paddingBottom: 5,
        },
        modalTypesTexts: {
            width: '100%',
            color: 'white',
            fontSize: 11,
            textAlign: 'center',
            backgroundColor: '#ff5e00',

            position: 'absolute',
            bottom: -20,
            width: '100%',
            border: '1px solid #ebebeb',
            marginLeft: -1,
        },

        // activeLastModalTypesBtn: {
        //     '@media screen and (min-width: 475px)': {
        //         gridColumn: 'span 2',
        //         // marginTop: 35,
        //         width: '90%'
        //     },
        //     // marginTop: 40,
        // },
        modalTypesIcons: {
            fontSize: 42,
            color: '#ff7600',
        },
        priceOrderContainer: {
            '& p': {
                display: 'grid',
                gridTemplateColumns: '70% 30%',
                'border-bottom': '1px dashed #ccc',
                '& span:last-child': {
                    textAlign: 'right'
                }
            },
            '@media screen and (max-width: 350px)': {
                marginTop: 40
            }
        },

        formButtons: {
            display: 'contents',
            padding: '3px 8px',
            fontSize: '12px !important'
        },

        changePaymentInstrumentButton: {
            width: '100%',
            background: '#e7e7e7',
            marginBottom: 10,
        }


    });
