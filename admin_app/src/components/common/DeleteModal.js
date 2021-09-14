import React from 'react'

const DeleteModal = (props) => (
    <div className="modal fade" id={"dangerModal" + props.id} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-danger" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title">Delete {props.title} ?</h4>
                    <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to delete '{props.title}'?</p>
                </div>
                {/* <div className="modal-footer"> */}
                <div className="modal-body">
                    <button className="btn btn-secondary" type="button" data-dismiss="modal">Close</button>
                    <button className="btn btn-danger fright" type="button" data-dismiss="modal" onClick={(e) => { props.deleteFunc(e, props.id) }}>Delete</button>
                </div>
            </div>
        </div>
    </div>
)

export default DeleteModal;