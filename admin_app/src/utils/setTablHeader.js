import axios from 'axios';

export default function setTablHeader(placeId) {
    axios.defaults.headers.common['tabl'] = 'tabl';
}