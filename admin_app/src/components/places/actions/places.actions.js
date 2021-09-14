import axios from 'axios';
import { LIST_PLACES, LIST_ORDERTYPES, LIST_FUNCTIONALITY_MODULES, GET_PLACES_SMS, GET_CITIES} from './types';
import { API_URL, ADMIN_URL } from './../../../constants';
import { addSuccessMessage, addErrorMessages } from './../../messages/messages.actions';
import { changeLanguage } from './../../../actions/languagesActions';
import Auth from './../../../utils/Auth';
import jwtDecode from 'jwt-decode';

export const listPlacesByUserRole = () => dispatch => {
    let currUser = jwtDecode(Auth.getToken());

    let query = "";
    if (currUser.role == "CLIENT_ADMIN") {
        query = `?client_id=${currUser.client_id}`

    } else if (currUser.role == "PLACE_ADMIN") {
        query = `?place_id=${currUser.place_id}`
    }

    axios
        .get(API_URL + `places${query}`)
        .then(res => {
            dispatch({
                type: LIST_PLACES,
                payload: res && res.data ? res.data : []
            });
        })
        .catch(error => {
            throw (error);
        });
}

export const addEditPlace = (postData) => dispatch => {
    // return axios({
    //     method: "post",
    //     url: API_URL + 'places',
    //     data: postData,
    //     headers: { "Content-Type": "multipart/form-data" },
    //   })
    return axios
        .post(API_URL + 'places', postData)

        .then((post) => {
            // post = post.data;
            // dispatch(addEditAllergenTranslation(post.id, langId, postData))
            // if (!postData.id && typeof postData.deleted === "undefined") { // edit
            // } else {
                dispatch(listPlacesByUserRole());
                // history.push(ADMIN_URL + 'clients');
                // dispatch(addSuccessMessage("Changes saved"))
                
            // }
        })

        
}


export const addRemoveOrdertype = (add = true, place_id, ordertype_id) => dispatch => {
    const route = add ? 'addOrdertype' : 'removeOrdertype';

    axios
        .post(API_URL + `places/${route}`, { "place_id": place_id, "ordertype_id": ordertype_id })
        .then(function (res) {
            dispatch(listPlacesByUserRole())

            if (res.error) {
                //TODO image not uploaded Toastr
            }
            else {
                // history.push(ADMIN_URL + 'products_admin');
            }
            // Error msg
            // history.push(ADMIN_URL + 'products');
        })
    // .catch(e =>
    //     // history.push(ADMIN_URL + 'products')
    // );

}

export const listOrderTypes = () => dispatch => {

    axios
        .get(API_URL + `ordertypes`)
        .then(res => {
            dispatch({
                type: LIST_ORDERTYPES,
                payload: res.data
            });
        })
        .catch(error => {
            throw (error);
        });
}

export const copyMenu = (from_place_id) => dispatch => {
    let to_place_id = Auth.getUserPlace();

    axios
        .post(API_URL + `copyMenuFromPlaceToAnother`, { "from_place_id": from_place_id, "to_place_id": to_place_id })
        .then(function (res) {
            dispatch(addSuccessMessage("Successfully copied menu"));

            // dispatch(listPlacesByUserRole())

            if (res.error) {
                //TODO image not uploaded Toastr
            }
            else {
                // history.push(ADMIN_URL + 'products_admin');
            }
            // Error msg
            // history.push(ADMIN_URL + 'products');
        })
        .catch(err => {
            dispatch(addErrorMessages(err.response.data.error.errors));
        })
}

export const initPlaceSettings = (placeId) => dispatch => {
    axios
        .post(API_URL + `settings/init_place_settings`, { "place_id": placeId })
        .then(function (res) {
            dispatch(addSuccessMessage(res.data.message));
        })
        .catch(err => {
            dispatch(addErrorMessages(err.response.data.error.errors));
        })
}

export const initSettingsForAllPlaces = () => dispatch => {

    axios
        .post(API_URL + `settings/initSettingsAllPlaces`, {})
        .then(function (res) {
            dispatch(addSuccessMessage(res.data.data.message));
        })
        .catch(err => {
            dispatch(addErrorMessages(err.response.data.error.errors));
        })
}


export const listFunctionalityModules = () => dispatch => {
    axios
    .get(API_URL + `functionalityModules`)
    .then(res => {
        dispatch({
            type: LIST_FUNCTIONALITY_MODULES,
            payload: res.data
        });
    })
    .catch(error => {
        throw (error);
    });
}


export const addRemoveFunctionalityModule = (add = true, place_id, module_id, price = null) => dispatch => {
    const route = add ? 'addFunctionalityModule' : 'removeFunctionalityModule';

    axios
        .post(API_URL + `places/${route}`, { "place_id": place_id, "module_id": module_id, "price": price })
        .then(function (res) {
            dispatch(listPlacesByUserRole())
            dispatch(addSuccessMessage("Changes saved"))

        })
        .catch(e => {

        });
}

export const getSmsesForPlacesByMonth = () => dispatch => {
    
    axios
    .get(API_URL + `logs/getSmsesForPlacesByMonth`)
    .then(res => {
        dispatch({
            type: GET_PLACES_SMS,
            payload: res && res.data ? res.data : []
        });
    })
    .catch(error => {
        throw (error);
    });
}



export const getCities = () => dispatch =>  {

    axios.get(API_URL + "getCities")
    .then(resp => {
        dispatch({
            type: GET_CITIES,
            payload: resp.data
        });
    })
    .catch(e => {

    });
}

// export const getTagsForMap = () => dispatch =>  {

//     axios.get(API_URL + "getTagsForMap")
//     .then(resp => {
//         dispatch({
//             type: GET_TAGS_FOR_MAP,
//             payload: resp.data
//         });
//     })
//     .catch(e => {

//     });
// }