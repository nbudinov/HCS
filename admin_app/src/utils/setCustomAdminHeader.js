import axios from 'axios';

export default function setCustomAdminHeader() {
    // if (token) {
        axios.defaults.headers.common['Admin'] = `1`;

        // console.log("TOKENN SETT", token);
        // console.log(axios.defaults.headers)
    // } else {
        // delete axios.defaults.headers.common['Admin'];
    // }
}