import axios from 'axios';

export default function setAuthorizationToken(token) {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // console.log("TOKENN SETT", token);
        // console.log(axios.defaults.headers)
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
}