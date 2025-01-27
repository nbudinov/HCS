import React from 'react'
import { NavLink } from 'react-router-dom';
import { ADMIN_URL } from '../../../../constants.js'
import DeleteModal from './../../../common/DeleteModal';
import Utils from '../../../../utils/Utils';
import moment from 'moment';

const ListEachTaskForUser = (props) => (
    <tr key={props.task.id}>
        <td>
            {props.task.name}
        </td>
        <td>
            {props.task.description}
        </td>
        <td>
            {props.task.checkpoint && props.task.checkpoint.name}
        </td>
        {/* <td>
            {props.task.rotation_start_date && moment(props.task.rotation_start_date).format("D-M-Y") || ""}
        </td>
        <td>
            {props.task.rotation_days_count}
        </td>
        <td>
            {props.task.times_per_day_of_task_execution}
        </td> */}

        <td>

            {props.task.times_per_day_of_task_execution == 1 ?
                <>
                    {props.task.completed == false? 
                        <button className=" btn btn-primary" type="submit" onClick={() => props.onCompleteTask(props.task.id)}>
                            {1 == 1 ? props.translations.tasks.complete_tasks : props.translations.tasks.completed}
                        </button>
                    :
                        <button className=" btn btn-success" disabled type="submit">
                            {props.translations.tasks.completed}
                        </button>
                    }
                </>
            :
                <>
                    {props.task.visits.length < props.task.times_per_day_of_task_execution ? 
                        <button className="btn btn-primary" type="submit" onClick={() => props.onCompleteTask(props.task.id)}>
                            {props.translations.tasks.complete_tasks} ( {props.task.visits.length} / {props.task.times_per_day_of_task_execution})
                        </button>
                    :
                        <button className=" btn btn-success" disabled type="submit">
                            {props.translations.tasks.completed} ({props.task.visits.length} / {props.task.times_per_day_of_task_execution})
                        </button>
                    }
                </>
            }

            {/* <NavLink to={ADMIN_URL + `checkpoints/${props.checkpointId}/tasks/${props.task.id}/edit`}>
                <button className="btn btn-pill btn-link" type="button">
                    <i className="fas fa-edit" title="Промяна"></i>
                </button>
            </NavLink>

            <button className="btn btn-pill btn-link" type="button" data-toggle="modal" data-target={"#dangerModal" + props.task.id} >
                <i className="fas fa-trash" title="Изтриване на задача"></i>
            </button>

            <DeleteModal
                id={props.task.id}
                title={props.task.name}
                deleteFunc={props.deleteCheckpoint}
            /> */}

        </td>
    </tr >
)

export default ListEachTaskForUser;