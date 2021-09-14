import React from 'react'
import { NavLink } from 'react-router-dom';
import { ADMIN_URL } from '../../../constants.js'
import UserOrdersModal from './UserOrdersModal.js';
import moment from 'moment';

const ListEachRegisteredUser = (props) => {
    if (props.user.email !== 'demo@tabl.bg') {

        return (
            <tr key={props.user.id}>
                <td>
                    {moment(props.user.createdAt).format("DD-MM-YYYY HH:mm")}
                </td>
                <td>
                    {props.user.email}
                </td>
                <td>
                    {props.user.fullname}
                </td>
                <td>
                    <a href={'tel:' + props.user.phone}>{props.user.phone}</a>
                </td>
                <td>
                    {props.user.address || "-"}
                </td>
                <td>
                    {props.user.active ? <span className="badge badge-success">{props.translations.common.active}</span> : <span className="badge badge-secondary">{props.translations.common.inactive}</span>}
                </td>
                <td>
                    <button className="btn btn-pill btn-link" type="button" data-toggle="modal" data-target={"#ordersModal" + props.user.id} >
                        {props.translations.common.orders} ({props.user.orders.length})
                    </button>

                    <UserOrdersModal
                        userId={props.user.id}
                        userEmail={props.user.email}
                        orders={props.user.orders}
                        settings={props.settings}
                        all_products={props.all_products}
                        translations={props.translations}
                        categoriesHierarchy={props.categoriesHierarchy}
                    />

                </td>
            </tr>
        )
    } else {
        return (<React.Fragment></React.Fragment>)
    }
}

export default ListEachRegisteredUser;