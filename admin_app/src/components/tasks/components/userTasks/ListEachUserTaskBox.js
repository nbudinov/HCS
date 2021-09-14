import React, { useRef } from 'react'

const ListEachUserTaskBox = (props) => {
    const componentRef = useRef();
    const getBoxBackground = (task) => {
        // let status, bill_wanted;
        // if (orderStatus) {
        //     status = orderStatus;
        // } else {
        //     status = order.status;
        //     bill_wanted = order.bill_wanted;
        // }

        // if (status == "rejected") {
        //     return 'repeating-linear-gradient(  45deg,  #ddd,  #cfcfcf 50px,  #ddd 50px,  #cfcfcf 50px)';
        // }

        // if (status == 'cooked_spot' || status == 'cooked_delivery' || status == 'cooked_preorder' || status == 'cooked_room') {
        //     return '#fff4cc';
        // }

        // if (status == 'served_spot' || status == 'on_the_way_delivery') {
        //     return '#ccfffd';
        // }

        // if (status == 'paid') {
        //     return '#cbffdd'
        // }

        // if (bill_wanted) {
        //     return '#ff6a6a';
        // }

        return 'white';
        // return key % 2 != 0 ? 'white' : '#f2f2f2';

    }

    


    return (
        <div className="col-sm-6 col-md-4 col-lg-4" style={{ padding: '0 7px' }}>
            <div className="card" style={{ borderRadius: 11 }}>
                <div className="card-body p-0 " style={{
                    background: getBoxBackground(props.task), borderRadius: 11,
                }}>

                    <div className="row">
                        <div className="col-md-12" style={{ padding: '5px 5px 15px 5px' }} >
                            <div style={{ textAlign: 'center' }}>
                                {props.task.name ? <React.Fragment>{props.task.name} <br /></React.Fragment> : null}
                                {/* {props.order.client_phone ? <React.Fragment><a href={"tel:" + props.order.client_phone.split(' ').join('')} >{props.order.client_phone}</a><br /></React.Fragment> : ''} */}

                            </div>
                        </div>

                        {/* <div className="col-md-6 col-sm-12" style={{ display: 'grid', gridTemplateColumns: '55% 45%', padding: '5px 5px 0 5px' }} > */}

                            
                            {/* <div style={{ textAlign: 'center' }}> */}
                                {/* <span style={{ color: 'rgb(83, 83, 83)' }}>{props.translations.orders.order_date_short} #{props.task.id * 1}</span>
                                <br />

                                <p>                                
                                </p> */}
                            {/* </div> */}

                            <div className="col-md-6 col-sm-12"  style={{ textAlign: 'center' }}>
                                <b>Описание: </b>
                                <br />
                                {props.task.description ? <React.Fragment>{props.task.description} <br /></React.Fragment> : "-"}
                                {/* {props.order.client_phone ? <React.Fragment><a href={"tel:" + props.order.client_phone.split(' ').join('')} >{props.order.client_phone}</a><br /></React.Fragment> : ''} */}

                            </div>

                            <div className="col-md-6 col-sm-12"  style={{ textAlign: 'center' }}>
                                <b>Локация: </b>
                                <br />
                                {props.task.checkpoint ? <React.Fragment>{props.task.checkpoint.name} <br /></React.Fragment> : null}
                                {/* {props.order.client_phone ? <React.Fragment><a href={"tel:" + props.order.client_phone.split(' ').join('')} >{props.order.client_phone}</a><br /></React.Fragment> : ''} */}

                            </div>

                        {/* </div> */}
                    </div>
                    

                    


                    <br />

                    {props.task.times_per_day_of_task_execution == 1 ?
                        <>
                            {props.task.completed == false? 
                                <button className=" btn btn-primary" type="submit" onClick={() => props.onCompleteTask(props.task.id)} style={{width: "100%"}}>
                                    {1 == 1 ? props.translations.tasks.complete_tasks : props.translations.tasks.completed}
                                </button>
                            :
                                <button className=" btn btn-success" disabled type="submit" style={{width: "100%"}}>
                                    {props.translations.tasks.completed}
                                </button>
                            }
                        </>
                    :
                        <>
                            {props.task.visits && props.task.visits.length < props.task.times_per_day_of_task_execution ? 
                                <button className="btn btn-primary" type="submit" onClick={() => props.onCompleteTask(props.task.id)} style={{width: "100%"}}>
                                    {props.translations.tasks.complete_tasks} ( {props.task.visits.length} / {props.task.times_per_day_of_task_execution})
                                </button>
                            :
                                <button className=" btn btn-success" disabled type="submit" style={{width: "100%"}}>
                                    {props.translations.tasks.completed} ({props.task.visits && props.task.visits.length || 0} / {props.task.times_per_day_of_task_execution})
                                </button>
                            }
                        </>
                    }
                  

                    {/* <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: 15, border: '1px solid #9c9c9c', padding: 2, 'border-radius': 5, width: 'fit-content', margin: '0 auto' }}><b>{props.order.total_price ? 'Общо: ' + props.order.total_price : null}&nbsp;{props.translations.common.currency}</b></p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        {props.order.discount_price && props.order.discount_price != 0 ?
                            <div style={{ textDecoration: props.order.promocode && props.order.promocode.ignore_other_discounts ? 'line-through' : 'none' }}>Отстъпка: {props.order.discount_price} {props.translations.common.currency} {props.order.discount_type == 'percent' && props.order.discount_value ? <span>({props.order.discount_value} %)</span> : null}</div>
                            :
                            null
                        }
                        {props.order.promocode && props.order.promocode.discount_value && props.order.promocode.discount_type ?
                            <div>Отстъпка Промокод: {props.order.promocode.discount_value} {props.order.promocode.discount_type == 'percent' ? '%' : props.translations.common.currency}</div>
                            :
                            null
                        }

                        {props.order.delivery_price && props.order.delivery_price != 0 ?
                            <div>Доставка: {props.order.delivery_price} {props.translations.common.currency}</div>
                            :
                            null
                        }

                        {countAdditionalPriceCalculated > 0 ?
                            <React.Fragment>
                                /{(props.translations && props.translations.common && props.translations.common.included ? props.translations.common.included : '')} {countAdditionalPriceCalculated} {(props.translations && props.translations.common && props.translations.common.box ? props.translations.common.box.toLowerCase() : '')}/
                            </React.Fragment>
                            :
                            ''
                        }
                    </div> */}


                    {/* <div className="progress progress-xs mt-2">
                        <div className="progress-bar bg-success" role="progressbar"
                            // style={{ width: '25%' }}
                            aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                    </div> */}

                    {/* {props.order.status == 'served_spot' || (props.order.bill_wanted && props.order.status != 'paid') ?
                        <button type="submit" className="btn btn-sm btn-success" onClick={() => { props.updateStatus(props.order.id, "paid", props.order) }} style={{ display: 'block', margin: '0 auto' }}>
                            <i className="fa fa-dot-circle-o"></i> {props.translations.common.paid}
                        </button>
                        :
                        null
                    } */}

                </div>
            </div>
        </div >

    );

}

export default ListEachUserTaskBox;