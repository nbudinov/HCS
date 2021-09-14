import axios from 'axios';
import { LIST_PRODUCTS, ADD_EDIT_PRODUCT_ERROR, ADD_EDIT_VARIANT_ERROR, ADD_EDIT_VARIANT_SUCCESS, ADD_EDIT_VARIANT_MESSAGE, ADD_EDIT_PRODUCT_TRANSLATION_ERROR, ADD_EDIT_PRODUCT_SUCCESS, SET_PRODUCT_FILTER, CLEAR_PRODUCT_FILTER } from './types';
import { API_URL, ADMIN_URL } from './../constants'
import { addErrorMessages, clearMessages, addSuccessMessage } from './../components/messages/messages.actions';
import Auth from './../utils/Auth';
import { showLoading, hideLoading } from './../components/common/loading/loading.actions';

export const listProducts = (place_id = 0) => dispatch => {
    if (place_id == 0) {
        place_id = Auth.getUserPlace();
    }
    axios
        .get(API_URL + 'products_admin?place_id=' + place_id)
        .then(res =>
            dispatch({
                type: LIST_PRODUCTS,
                payload: res && res.data || []
            })
        ).catch(error => {
            throw (error);
        });
}

export const bulkAddProducts = (data, history) => dispatch => {

    dispatch(showLoading());

    axios
        .post(API_URL + `products/bulk_create?placeId=${Auth.getUserPlace()}`, data, { 'Content-Type': 'multipart/form-data' })
        .then(
            function (post) {
                dispatch(listProducts());
                dispatch(hideLoading());

                history.push(ADMIN_URL + 'products');
            }
        )
        .catch(function (error) {
            dispatch(addErrorMessages(error.response.data.error.errors));
        });

}

export const addProduct = (postData, history, imageData, langId) => dispatch => {
    dispatch(showLoading());

    axios
        .post(API_URL + 'products', postData)
        .then(
            function (post) {
                // if (post.error) {
                //     dispatch({
                //         type: ADD_EDIT_PRODUCT_ERROR,
                //         payload: post.error.errors
                //     })
                // } else {
                post = post.data;
                dispatch(addEditProductTranslation(post.id, langId, postData));
                dispatch(addImage(imageData, post.id, history));

                dispatch(listProducts());
                dispatch(hideLoading());
                // history.push(ADMIN_URL + 'products_admin');
                // history.push(ADMIN_URL + 'products/edit/' + post.id)
                history.push(ADMIN_URL + 'products/edit/' + post.id + '#variants')
                // }
                dispatch({
                    type: ADD_EDIT_PRODUCT_SUCCESS,
                    payload: "Success"
                })
            }
        )
        .catch(function (error) {
            dispatch(addErrorMessages(error.response.data.error.errors));
        });
}

export const editProduct = (postData, history = null, imageData = null, langId = null) => dispatch => {
    axios
        .put(API_URL + 'products/' + postData.id, postData)
        .then(function (post) {

            post = post.data;
            if (!post.deleted) {

                if (langId) {
                    dispatch(addEditProductTranslation(post.id, langId, postData));
                }

                if (history) {
                    if (imageData.has("file")) {
                        dispatch(addImage(imageData, post.id, history));
                    } else {
                        dispatch(listProducts());
                        dispatch(addSuccessMessage("Success editing product"))
                    }

                } else {
                    // from /list
                    dispatch(addSuccessMessage("Success editing product"))

                    dispatch(listProducts())
                }
            }
            dispatch({
                type: ADD_EDIT_PRODUCT_SUCCESS,
                payload: "Success"
            })
            // }
        }
        )
        .catch(function (error) {
            dispatch(addErrorMessages(error && error.response && error.response.data && error.response.data.error && error.response.data.error.errors ? error.response.data.error.errors : 'Error'));
        });
}


export const removeProduct = (id, history) => dispatch => {
    axios
        .put(API_URL + 'products/' + id, { deleted: true })
        .then(
            function (res) {
                if (history) {
                    // Deleting from /edit
                    history.push(ADMIN_URL + "products")
                } else {
                    // Deleting from /list
                    dispatch(listProducts())
                }
            }
        )
        .catch(function (e) {
            console.log("error", e);
        });
}

export const addEditProductTranslation = (prod_id, lang_id, data) => dispatch => {
    axios
        .post(API_URL + `products/${prod_id}/translations/${lang_id}`, data)
        .then(res => {
            dispatch(listProducts())
        })
        .catch(err => { })
}

export const addVariant = (postData, history, langId) => dispatch => {

    axios
        .post(API_URL + 'product_variants', postData)
        .then(
            function (post) {
                // if (post.error) {
                //     dispatch({
                //         type: ADD_EDIT_VARIANT_ERROR,
                //         payload: post.error.errors
                //     })
                // } else {
                post = post.data;
                dispatch(addEditProductVariantTranslation(post.id, langId, postData));
                dispatch(listProducts())
                dispatch(clearMessages());
                //history.push(ADMIN_URL + 'products_admin');
                // }
            }
        )
        .catch(function (e) {
            console.log("error", e);
        });

}

export const editVariant = (postData, history, langId) => dispatch => {
    axios
        .put(API_URL + 'product_variants/' + postData.id, postData)
        .then(function (post) {
            // if (post.error) {
            //     dispatch({
            //         type: ADD_EDIT_VARIANT_ERROR,
            //         payload: post.error.errors
            //     })
            // } else {
            post = post.data;
            if (!post.deleted) {
                dispatch(addEditProductVariantTranslation(post.id, langId, postData));
            }

            dispatch(listProducts())
            //history.push(ADMIN_URL + 'products_admin');
            // }
        }
        )
        .catch(function (e) {
            console.log("error", e);
        });

}

export const addEditProductVariantTranslation = (product_variant_id, lang_id, data) => dispatch => {
    axios
        .post(API_URL + `product_variants/${product_variant_id}/translations/${lang_id}`, data)
        .then(res => {
            dispatch(listProducts())
        })
        .catch(err => { })
}

export const addImage = (file, productId, history) => dispatch => {
    if (file == null) {
        history.push(ADMIN_URL + 'products');
        return;
    }

    axios
        .post(API_URL + `products/${productId}/upload?placeId=${Auth.getUserPlace()}`, file)
        .then(function (res) {
            dispatch(listProducts())
            dispatch(addSuccessMessage("Success editing product"))
            // history.push(ADMIN_URL + 'products/edit/'+productId);
        })
        .catch(e => {
            if(e && e.response.data && e.response.data.error && e.response.data.error.errors) {
                dispatch(addErrorMessages(e.response.data.error.errors))
            } else { 
                dispatch(addErrorMessages(['Upload image error']))                
            }
        });
}

export const removeImage = (productId, history) => dispatch => {

    axios
        .post(API_URL + `products/delete_image`, { "productId": productId })
        .then(function (res) {
            dispatch(addSuccessMessage("Success removing image"))
            dispatch(listProducts())

            // Error msg
            // history.push(ADMIN_URL + 'products/edit/'+productId);
        })
        .catch(e => {
            dispatch(addSuccessMessage("Error removing image"))

            // history.push(ADMIN_URL + 'products/edit/'+productId)
        });
}

export const addRemoveAllergen = (addAllergen = true, productId, allergenId) => dispatch => {
    const allergenRoute = addAllergen ? 'add_allergen' : 'remove_allergen';

    axios
        .post(API_URL + `products/${allergenRoute}`, { product_id: productId, allergen_id: allergenId })
        .then(function (res) {
            dispatch(listProducts())

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

export const addRemoveProductIngredient = (adding = true, data) => dispatch => {
    const route = adding ? 'add_ingredient' : 'remove_ingredient';

    axios
        .post(API_URL + `products/${route}`, data)
        .then(function (res) {
            dispatch(listProducts())

            if (adding) {
                dispatch(addSuccessMessage("Success adding ingredient"))
            } else {
                dispatch(addSuccessMessage("Success removing ingredient"))
            }
        })
        .catch(err => {
            dispatch(addErrorMessages(err.response.data.error.errors));
        })

}

export const addRemoveRelatedProduct = (data) => dispatch => {
    axios
        .post(API_URL + `products/add_remove_related_product`, data)
        .then(function (res) {
            dispatch(listProducts())

            // if(adding) {
            dispatch(addSuccessMessage("Success editing product"))
            // } else {
            // dispatch(addSuccessMessage("Success removing ingredient"))
            // }
        })
        .catch(err => {
            dispatch(addErrorMessages(err.response.data.error.errors));

        })
}



export const setProductFilter = (name, value) => dispatch => {
    dispatch({
        type: SET_PRODUCT_FILTER,
        payload: { name: name, value: value }
    });
}

export const clearProductFilter = () => dispatch => {
    dispatch({
        type: CLEAR_PRODUCT_FILTER,
    });
}

export const bulkUpdateProductsField = (data) => dispatch => {
    axios
        .post(API_URL + `products/bulk_update_products_field`, data)
        .then(function (res) {
            dispatch(listProducts())

            // if(adding) {
            dispatch(addSuccessMessage("Success editing products"))
            // } else {
            // dispatch(addSuccessMessage("Success removing ingredient"))
            // }
        })
        .catch(err => {
            dispatch(addErrorMessages(err.response.data.error.errors));

        })
}