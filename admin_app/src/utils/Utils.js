import { API_TOKEN, SETTINGS_IMG_URL, PRODUCT_THUMB_IMG_URL, PRODUCT_IMG_URL, INVOICES_PATH, PLACE_IMG_URL } from '../constants'
// import history from './history';
import { history } from './../store';
import { translations } from '../components/common/translations';
import Auth from './Auth';
import store from './../store';

let md5 = require('md5');

class Utils {

	static generateCheckpointToken(tableNum) {
		return md5(md5(tableNum + (+new Date)))
	}

	static cropMail(email) {
		if (email && (email.indexOf("@") !== -1)) {
			return email.split("@")[0];
		}
		return email;
	}

	static objectToFormData(obj) {
		let formData = new FormData();
		for (var key in obj) {
			formData.append(key, obj[key]);
		}
		return formData;
	}

	static onChange(e) {
		return { [e.target.name]: (e.target.type && e.target.type === 'number') ? parseFloat(e.target.value) : e.target.value }
	}

	static onChangeCheckbox(e) {
		return { [e.target.name]: e.target.checked ? 1 : 0 };
	}

	static truncate(input, maxInputLength = 15, cutFirstXSymbold = 5) {
		if (input.length == 0) return '-';

		if (input.length > maxInputLength)
			return input.substring(0, cutFirstXSymbold) + '...';
		else
			return input;
	}

	static appendLeadingZeroes = (n) =>
		(n <= 9 ? "0" + n : n)

	static appendTokenToFormData = (formData) =>
		(formData.append('Authorization', API_TOKEN))


	static buildURLQuery = (obj) =>
		Object.entries(obj)
			.map(pair => pair.map(encodeURIComponent).join('='))
			.join('&');

	static changeListDateFormat = (d) => {
		let bgMonths = [];
		bgMonths[0] = 'яну';
		bgMonths[1] = 'фев';
		bgMonths[2] = 'март';
		bgMonths[3] = 'апр';
		bgMonths[4] = 'май';
		bgMonths[5] = 'юни';
		bgMonths[6] = 'юли';
		bgMonths[7] = 'авг';
		bgMonths[8] = 'сеп';
		bgMonths[9] = 'окт';
		bgMonths[10] = 'ное';
		bgMonths[11] = 'дек';

		return Utils.appendLeadingZeroes(d.getDate()) + '-' + bgMonths[d.getMonth()] + '-' + d.getFullYear() + ' ' + Utils.appendLeadingZeroes(d.getHours()) + ':' + Utils.appendLeadingZeroes(d.getMinutes())
	}

	static errorHandler(error) {
		const customErrorMsg = "Възникна грешка #";
		let errorCode = 0;

		// https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
		if (error.response) {
			errorCode = 1;
			console.log(error.response.data); //DO NOT REMOVE
			console.log(error.response.status); //DO NOT REMOVE
			console.log(error.response.headers); //DO NOT REMOVE
			/*
				* The request was made and the server responded with a
				* status code that falls out of the range of 2xx
			*/
		} else if (error.request) {
			errorCode = 2;
			errorCode += ' - Проблем със сървъра или слаб интернет!';
			/*
			* The request was made but no response was received, `error.request`
			* is an instance of XMLHttpRequest in the browser and an instance
			* of http.ClientRequest in Node.js
			*/
			console.log(error.request); //DO NOT REMOVE
		} else {
			errorCode = 3;
			// Something happened in setting up the request and triggered an Error
			console.log('Error', error.message); //DO NOT REMOVE
		}

		return customErrorMsg + errorCode;
	}

	static navigateTo = (url) => {
		history.push(url);
	}
	static goBack = () => {
		history.goBack();
	}

	// {Utils.translate(this.props.translations.common.dashboard, {count: 5, total: 8})}
	static translate(text, args = {}) {
		if (Object.keys(args).length === 0) {
			return text;
		}

		Object.entries(args).map(a => text = text.replace('{' + a[0] + '}', a[1]))
		return text;
	}


	static normalizePrice = (price) => {
		return price.toFixed(2);
	}

	static compareForPriority = (asc = true) => {
		return function (a, b) {
			let priorityOne = a.priority;
			let priorityTwo = b.priority;
			// // nulls sort after anything else
			// if (priorityOne === 0) {
			//     return 1;
			// }
			// else if (priorityTwo === 0) {
			//     return -1;
			// }
			// // otherwise, if we're ascending, lowest sorts first
			// return priorityOne < priorityTwo ? -1 : 1;

			return (priorityOne < priorityTwo) ? -1 : ((priorityOne > priorityTwo) ? 1 : 0);

		};
	}

	static sortName = (asc = true, column = 'name') => {
		return function (a, b) {
			var nameA = a[column].toUpperCase(); // ignore upper and lowercase
			var nameB = b[column].toUpperCase(); // ignore upper and lowercase
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}

			// names must be equal
			return 0;
		}
	}

	

	static getCurrClientPlacesCount(allPlaces) {
		let currPlaceId = Auth.getUserPlace();
		let currClientPlacesCount = 0;

		if (allPlaces) {
			let currPlace = allPlaces.find(p => p.id == currPlaceId);
			if (currPlace) {
				let currPlaceClientId = currPlace.clientId;
				currClientPlacesCount = allPlaces.filter(p => p.clientId == currPlaceClientId).length;
			}
		}

		return currClientPlacesCount;
	}

	static getOptionsForAutocompleteSelect(cats, returnOptions = true) {
		let categoriesHierarchyOptions = [];
		let returnCatObejct = [];

		if (cats) {
			Object.values(cats).map(cat => {

				let undeletedChildrenCount = cat.children.filter(c => c.deleted == 0).length;
				if (cat.active == 1 && cat.deleted == 0 && (cat.children.length == 0 || undeletedChildrenCount == 0)) {

					if (returnOptions) {
						let dashes = '';
						for (let i = 0; i < cat.hierarchyLevel - 1; i++) {
							dashes += "-";
						}

						categoriesHierarchyOptions.push({
							'value': cat.id,
							'label': dashes + cat.name + (cat.code ? ' (' + cat.code + ')' : '') + (cats && cats[cat.parentId] && cats[cat.parentId].name ? (" /" + cats[cat.parentId].name + '/') : '')
						});
					} else {
						returnCatObejct.push(cat)
					}

				}
			});
		}
		return returnOptions ? categoriesHierarchyOptions : returnCatObejct;
	}

	

}

export default Utils;