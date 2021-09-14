import React from 'react'
import { NavLink } from 'react-router-dom';
import { ADMIN_URL, IMG_PATH } from '../../../constants.js'

const ListEachTask = (props) => (
    <tr key={props.task.id}>
        <td>
            {props.task.name}
        </td>
        <td>
            {props.task.description}
        </td>
        <td>
            {props.task.checkpoint && props.task.checkpoint.name || "-"}
        </td>
        <td>
            {typeof props.task.users != undefined && props.task.users && props.task.users.length > 0 && props.task.users.map(u => (
                <p key={u.id}>
                    {u.visits && u.visits.length < props.task.times_per_day_of_task_execution ? 
                        <button className="btn btn-danger" disabled type="submit">
                            {u.email} - {props.translations.tasks.not_completed} 
                            {props.task.times_per_day_of_task_execution > 1 ? 
                                <>
                                    ( {u.visits && u.visits.length || 0} / {props.task.times_per_day_of_task_execution})
                                </>
                            :
                                null
                            } 
                        </button>
                    :
                        <button className=" btn btn-success"  type="submit" onClick={() => props.openVisitDetailsModal(props.task, u)}>
                            {u.email} - {props.translations.tasks.completed} ({u.visits && u.visits.length || 0} / {props.task.times_per_day_of_task_execution})
                            <br/>
                            <span style={{fontSize: 10}}>(кликни за дейтайли)</span>
                        </button>
                    }
                </p>
            )) || "Няма назначени потребители"}
        </td>
        <td>
            <NavLink to={ADMIN_URL + `checkpoints/${props.task.checkpointId}/tasks/${props.task.id}/edit`}>
                <button className="btn btn-pill btn-link" type="button">
                    <i className="fas fa-edit" title="Промяна на задача"></i>
                </button>
            </NavLink>
        </td>
    </tr>
)

export default ListEachTask;