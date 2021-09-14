import axios from 'axios';

export default function setCustomPlaceHeader(placeId) {
    if (placeId) {
        // console.log("SETTING PLACE HEADER ", placeId)
        axios.defaults.headers.common['place'] = placeId;

        // console.log("TOKENN SETT", token);
        // console.log(axios.defaults.headers)
    } else {
        delete axios.defaults.headers.common['place'];
    }
}