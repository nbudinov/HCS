import Cookies from 'universal-cookie';
import jwt from 'jsonwebtoken';
import setCustomPlaceHeader from './setCustomPlaceHeader';

const cookies = new Cookies();

const TABL_USER_TOKEN_KEY = '_tut_';     // THE TOKEN FOR THE USER LOGIN   (table_user_token)

class Auth {

	static getDecodedUser() {
		const userJSON = window.localStorage.getItem(TABL_USER_TOKEN_KEY)
		if (userJSON) {
			return jwt.decode((userJSON));
		}
		// console.log('nqma user')
		return {}
	}

	static isUserAuthenticated() {
		return window.localStorage.getItem(TABL_USER_TOKEN_KEY) !== null
	}

	static setToken(token) {
		localStorage.setItem(TABL_USER_TOKEN_KEY, token);
	}

	static getToken() {
		return window.localStorage.getItem(TABL_USER_TOKEN_KEY)
	}

	static removeToken() {
		return window.localStorage.removeItem(TABL_USER_TOKEN_KEY)
	}

	static hasAccess(requiredRole) {
		let currentUser = this.getDecodedUser();
		if (!currentUser) {
			return false;
		}

		let currentRole = currentUser.role;
		// console.log('currentRole', currentRole);
		// console.log('requiredRole', requiredRole);

		switch (requiredRole) {
			case 'USER':
				return true;
			case 'PLACE_ADMIN':
				return (currentRole == 'PLACE_ADMIN' || currentRole == 'CLIENT_ADMIN' || currentRole == 'SUPER_ADMIN')
			case 'CLIENT_ADMIN':
				return (currentRole == 'CLIENT_ADMIN' || currentRole == 'SUPER_ADMIN')
			case 'SUPER_ADMIN':
				return (currentRole == 'SUPER_ADMIN')
			default:
				return false;
		}
	}

	static hasAccessCustom(allowedRoles) {
		let currentUser = this.getDecodedUser();
		if (!currentUser) {
			return false;
		}

		let currentRole = currentUser.role;

		if (allowedRoles.includes(currentRole)) {
			return true;
		} else {
			return false;
		}
	}


	static setUserPlace(place_id) {
		const current = new Date();
		const after100Years = new Date();
		after100Years.setFullYear(current.getFullYear() + 100);

		if (place_id) {
			cookies.set('tabl_a_place', place_id, { path: '/', expires: after100Years });
			setCustomPlaceHeader(place_id);
		}
	}

	static getUserPlace() {
		return cookies.get('tabl_a_place');
	}

}

export default Auth
