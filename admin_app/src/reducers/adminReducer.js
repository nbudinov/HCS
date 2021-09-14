import { SET_SOUND_ACTIVATION, CHANGE_ORDER_STYLE_TYPE, SET_SNACKBAR_TEXT, OPEN_CONFIRM_MODAL, CLOSE_CONFIRM_MODAL } from '../actions/types';

let orderTypeStyles = {};
orderTypeStyles['row'] = 'box';
orderTypeStyles['box'] = 'row';

const initialState = {
    soundActivated: false,
    orderStyleType: 'row', // ['row','box']
    snackbarText: '',
    snackbarActionCallback: () => { },
    snackbarActionText: '',
    openConfirmModal: false,
    confirmModalText: '',
    confirmModalCallbackSuccess: () => void (0),
    confirmModalCallbackFail: () => void (0),
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_SOUND_ACTIVATION:
            return {
                ...state,
                soundActivated: action.payload,
            }
        case CHANGE_ORDER_STYLE_TYPE:
            return {
                ...state,
                orderStyleType: orderTypeStyles[state.orderStyleType], //if is row will set box and so on..
            }
        case SET_SNACKBAR_TEXT:
            return {
                ...state,
                snackbarText: action.payload.text,
                snackbarActionText: action.payload.actionText,
                snackbarActionCallback: action.payload.callback,
            }
        case OPEN_CONFIRM_MODAL:
            return {
                ...state,
                openConfirmModal: true,
                confirmModalText: action.payload.text,
                confirmModalCallbackSuccess: action.payload.callbackSuccess,
                confirmModalCallbackFail: action.payload.callbackFail,
            }
        case CLOSE_CONFIRM_MODAL:
            return {
                ...state,
                openConfirmModal: false,
            }
        default:
            return state;
    }
}