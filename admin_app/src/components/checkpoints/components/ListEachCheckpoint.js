import React from 'react'
import { NavLink } from 'react-router-dom';
import { ADMIN_URL } from '../../../constants.js'
import Auth from '../../../utils/Auth';
import DeleteCheckpointModal from './../../common/DeleteModal';
import Utils from '../../../utils/Utils';

function copy(checkpointId) {
    var copyText = document.querySelector("#checkpoint_" + checkpointId);
    copyText.select();
    document.execCommand("copy");
}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = window.location.origin + '/t/' + text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    document.execCommand('copy');
    document.body.removeChild(textArea);
}

const ListEachCheckpoint = (props) => (
    <tr key={props.checkpoint.id}>
        <td>
            {/* If not added translation for the defailt language */}
            {props.checkpoint.name}
            {/* {Auth.hasAccess("SUPER_ADMIN") ?
                <React.Fragment>
                    <br />
                    <input type="text" id={"checkpoint_" + props.checkpoint.id} value={props.checkpoint.checkpoint_token} onClick={() => copy(props.checkpoint.id)} title="Copy token" readOnly/>

                    <button className="btn btn-pill btn-link" type="button" onClick={() => fallbackCopyTextToClipboard(props.checkpoint.checkpoint_token)} title="Copy full link" style={{
                        border: '1px solid',
                        'marginLeft': 13,
                        'verticalAlign': 'initial',
                        'borderRadius': 3,
                    }}>
                        <i className="fas fa-copy"></i>
                    </button>

                </React.Fragment>
                :
                null
            } */}
        </td>
        {/* <td>
            {props.checkpoint.link}
        </td> */}

        <td>
            <NavLink to={ADMIN_URL + 'checkpoints/edit/' + props.checkpoint.id}>
                <button className="btn btn-pill btn-link" type="button">
                    <i className="fas fa-edit" title="Промяна"></i>
                </button>
            </NavLink>

            <NavLink to={ADMIN_URL + 'checkpoints/' + props.checkpoint.id + '/tasks'}>
                <button className="btn btn-pill btn-link" type="button">
                    <i className="fas fa-list" rel="tooltip" title="Задачи за локацията"></i> 
                </button>
            </NavLink>

            <button className="btn btn-pill btn-link" type="button" data-toggle="modal" data-target={"#dangerModal" + props.checkpoint.id} >
                <i className="fas fa-trash" title="Изтриване на локацията"></i>
            </button>

            <DeleteCheckpointModal
                id={props.checkpoint.id}
                title={props.checkpoint.name}
                deleteFunc={props.deleteCheckpoint}
            />

        </td>
    </tr >
)

export default ListEachCheckpoint;