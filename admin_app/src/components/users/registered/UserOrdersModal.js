import React from 'react'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Utils from './../../../utils/Utils';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '50%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  }));


  const UserOrdersModal = (props) => {

    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div className="modal fade" id={"ordersModal" + props.userId} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-success" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">Orders</h4>
                        <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {props.orders.map(o => {

                            let products = Object.values(o.order_productvariants).map((opv, ind) => {
                                const prodComment = o.order_comment ? JSON.parse(o.order_comment).find(p => p.variantId === opv.productVariantId) : undefined;
                                let productRequiredIngredientIds = [];
                                let productAddablengredientIds = [];
                                let productRemovableIngredientIds = [];
                                // console.log('o', o)
                                // console.log('object', object)
                                return <p key={ind}>{opv.quantity} x <b>{props.all_products && props.all_products[opv.product_variant.productId] && props.all_products[opv.product_variant.productId].name ? props.all_products[opv.product_variant.productId].name : ''}</b> - <i>{opv.product_variant.size}</i> /{opv.product_variant.price} {(props.settings.default_currency_suffix && props.settings.default_currency_suffix.value ? props.settings.default_currency_suffix.value : 'лв.')}/
                                    -&nbsp;
                                    <span style={{ 'text-decoration': 'none', background: '#e8e8e8', 'border-radius': 4, padding: '1px 5px' }} >
                                        ({props.categoriesHierarchy && props.categoriesHierarchy[opv.catHierarchyId] ? props.categoriesHierarchy[opv.catHierarchyId].name : ''})
                                        </span>
                                    {((o.ordertypeId == 2 || o.ordertypeId == 3) && ((props.settings && props.settings.show_variant_additional_price && props.settings.show_variant_additional_price.value && props.settings.show_variant_additional_price.value == 1) && ((parseFloat(opv.product_variant.additional_price)).toFixed(2) != '0.00')) ? (' + ' + (props.translations && props.translations.common && props.translations.common.box ? props.translations.common.box : '') + ' ' + opv.product_variant.additional_price + ' ' + (props.settings.default_currency_suffix && props.settings.default_currency_suffix.value ? props.settings.default_currency_suffix.value : 'лв.')) : '')}
                                    {prodComment && prodComment.comment ? <> - <span className="badge badge-secondary">{prodComment.comment}</span></> : null}
                                    {opv.opv_ingredients.map(ing => {
                                        if (ing.ingredient_type == "required") {
                                            productRequiredIngredientIds.push(ing.ingredientId);
                                        }
                                        if (ing.ingredient_type == "addable") {
                                            productAddablengredientIds.push(ing.ingredientId);
                                        }
                                        if (ing.ingredient_type == "removable") {
                                            productRemovableIngredientIds.push(ing.ingredientId);
                                        }
                                    })}

                                    {
                                        productRequiredIngredientIds.length > 0 ?
                                            <div style={{ fontStyle: 'italic' }}>{Utils.getIngredientNamesByIds(props.ingredients, productRequiredIngredientIds)}</div>
                                            :
                                            null
                                    }

                                    {
                                        productAddablengredientIds.length > 0 ?
                                            <div style={{ color: '#008017', fontStyle: 'italic' }}>+ {Utils.getIngredientNamesByIds(props.ingredients, productAddablengredientIds)}</div>
                                            :
                                            null
                                    }

                                    {
                                        productRemovableIngredientIds.length > 0 ?
                                            <div style={{ color: '#c50000', fontStyle: 'italic' }}>- {Utils.getIngredientNamesByIds(props.ingredients, productRemovableIngredientIds)}</div>
                                            :
                                            null
                                    }

                                </p>
                            })

                            return (
                                <ExpansionPanel>
                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography className={classes.heading}>{moment(o.createdAt).format('DD-MM-YYYY HH:mm')}</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <Typography>
                                            {props.translations.common.order_type} - <b>{o.ordertype.type}</b>
                                            <br/>
                                            {props.translations.common.total_amount} - <b>{o.total_price ? o.total_price : null}</b>&nbsp;
                                            {props.translations.common.currency}

                                            {o.discount_price && o.discount_price != 0 ?
                                                <div>Отстъпка: {o.discount_price} {props.translations.common.currency} {o.discount_type == 'percent' && o.discount_value ? <span>({o.discount_value} %)</span> : null}</div>
                                                :
                                                null
                                            }

                                            {o.delivery_price && o.delivery_price != 0 ?
                                                <div>Доставка: {o.delivery_price} {props.translations.common.currency}</div>
                                                :
                                                null
                                            }
                                            <br/>
                                            {products}
                                        </Typography>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            )
                        })}
                    </div>
                    {/* <div className="modal-footer"> */}
                    {/* <div className="modal-body">
                        <button className="btn btn-secondary" type="button" data-dismiss="modal">Close</button>
                        <button className="btn btn-danger fright" type="button" data-dismiss="modal" onClick={(e) => { props.deleteUser(e, props.userId, props.userEmail) }}>Delete</button>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default UserOrdersModal;