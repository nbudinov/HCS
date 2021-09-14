import React from 'react'

const DeletePlaceModal = (props) => (
    <div className="modal fade" id={"dangerModal" + props.id} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-danger" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title">{props.translations.places.delete.title}</h4>
                    <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <p>{props.translations.places.delete.confirm} '{props.name}'?</p>
                </div>
                {/* <div className="modal-footer"> */}
                <div className="modal-body">
                    <button className="btn btn-secondary" type="button" data-dismiss="modal" style={{ float: 'left' }}>{props.translations.common.close}</button>
                    <button className="btn btn-danger fright" type="button" data-dismiss="modal" onClick={(e) => { props.deletePlace(e, props.id) }}>{props.translations.common.delete}</button>
                </div>
            </div>
        </div>
    </div>
)

export default DeletePlaceModal;