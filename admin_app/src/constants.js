let currentDomain = window.location.origin + '/';
let apiDomain = currentDomain;
let imgPath = currentDomain + "admin/";

if (window.location.hostname == 'localhost') {
    apiDomain = 'http://localhost:4000/'; // Custom api requests ulr
    imgPath = currentDomain;
}

export const API_DOMAIN = apiDomain;
export const SCAN_URL = apiDomain + "t/";
export const API_URL = apiDomain + "api/";
export const ADMIN_URL = "/admin/";
export const PUBLIC_PATH = currentDomain + "admin/";

// Pagination
export const ITEMS_PER_PAGE = 8;
export const ITEMS_PAGE_RANGE_DISPLAYED = 5;

// Image paths
export const PUBLIC_IMAGE_PATH = apiDomain;
export const IMG_PATH = currentDomain + "files/images/";
export const PRODUCT_THUMB_IMG_URL = currentDomain + "files/images_thumbs/";
export const PRODUCT_IMG_URL = apiDomain + "files/images/";
export const SETTINGS_IMG_URL = apiDomain + "files/images/";
export const PLACE_IMG_URL = apiDomain + "files/places/";

export const IMAGE_CAT_IMAGES_PATH = currentDomain + "files/category_menu_images/";
export const DEFAULT_CATEGORIES_IMAGES_PATH = currentDomain + "files/defaultCategoryImages/"

export const FILTER_PLACES_NAME = 'places_ids';

export const ADMIN_QR_CODE_DATA = {
    width: 400,
    height: 400,
    margin: 15,
    // data: '',
    image: null, //tablLogo,
    // image: tablLogoBlack,
    "qrOptions": {
        "typeNumber": "0",
        "mode": "Byte",
        "errorCorrectionLevel": "Q"
    },
    "imageOptions": {
        "hideBackgroundDots": true,
        "imageSize": 0.4,
        "margin": 0
    },
    "dotsOptions": {
        "type": "square",
        // "type": "rounded",
        "color": "#000000"
    },
    "backgroundOptions": {
        "color": "#ffffff"
    },
    "dotsOptionsHelper": {
        "colorType": {
            "single": true,
            "gradient": false
        },
        "gradient": {
            "linear": true,
            "radial": false,
            "color1": "#6a1a4c",
            "color2": "#6a1a4c",
            "rotation": "0"
        }
    },
    "cornersSquareOptions": {
        // "type": "",
        "type": "square",
        "color": "#000000"
    },
    "cornersSquareOptionsHelper": {
        "colorType": {
            "single": true,
            "gradient": false
        },
        "gradient": {
            "linear": true,
            "radial": false,
            "color1": "#000000",
            "color2": "#000000",
            "rotation": "0"
        }
    },
    "cornersDotOptions": {
        "type": "",
        "color": "#f66201"
        // "color": "#000000" // Black
    },
    "cornersDotOptionsHelper": {
        "colorType": {
            "single": true,
            "gradient": false
        },
        "gradient": {
            "linear": true,
            "radial": false,
            "color1": "#000000",
            "color2": "#000000",
            "rotation": "0"
        }
    },
    "backgroundOptionsHelper": {
        "colorType": {
            "single": true,
            "gradient": false
        },
        "gradient": {
            "linear": true,
            "radial": false,
            "color1": "#ffffff",
            "color2": "#ffffff",
            "rotation": "0"
        }
    }
}

export const ADMIN_VERSION = '03.04.2021-1';

//Reservations
export const API_TOKEN = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0YWJsIiwiYXVkIjoiVEhFX0FVRElFTkNFIiwiaWF0IjoxNTcxMDkzNzMyLCJuYmYiOjE1NzEwOTM3NDIsImV4cCI6MTcyODc3MzczMiwiZGF0YSI6eyJpZCI6IjEiLCJmaXJzdG5hbWUiOiJ0ZXN0IiwibGFzdG5hbWUiOm51bGwsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSJ9fQ.wdL6RIeLM3FmojeDZuz6BBsGg1BBSHn4vX3-nYyNdHk';