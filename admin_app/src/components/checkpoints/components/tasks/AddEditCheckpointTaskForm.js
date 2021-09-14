import React, { Component, createRef } from 'react'
import { NavLink } from 'react-router-dom';
import DeleteCheckpointModal from './../../../common/DeleteModal';
import MessagesContainer from './../../../messages/MessagesContainer';
import { SCAN_URL, ADMIN_URL} from './../../../../constants';
import Select from 'react-select'
import DatePicker from 'react-datepicker';

class AddEditCheckpointTaskForm extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
       
    }

    componentWillReceiveProps(){
        
    }

    render() {
        const props = this.props;
       
        let usersOptions = [];
        // autocompleteCats.push({ 'value': null, 'label': "Основна категория (категория родител)" })
        Object.values(props.users).map(user => {

            // if (cat.active == 1 && cat.deleted == 0) {
            //     let dashes = '';
            //     for (let i = 0; i < cat.hierarchyLevel - 1; i++) {
            //         dashes += "-";
            //     }

            usersOptions.push({ 'value': user.id, 'label': user.email });
        });

        return (

            <form>
                <div className="card-body">
                    <MessagesContainer />

                    {/* <div ref={ref} /> */}

                    {/* <qrCd /> */}

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor="name">{props.translations.common.name}</label>
                                <input className={`form-control`} id="name" type="text" title={"latin"} placeholder={props.translations.common.name} name="name" onChange={props.onChange} value={props.task.name} />
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor="name">{props.translations.common.description}</label>
                                <input className={`form-control`} id="description" type="text" title={"latin"} placeholder={props.translations.tasks.description} name="description" onChange={props.onChange} value={props.task.description} />
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div className="form-group">
                                <label htmlFor="name">{props.translations.tasks.rotation_start_date}</label>
                                <br/>
                                <DatePicker
                                            className="form-control vertical-center"
                                            selected={props.task.rotation_start_date}
                                            onChange={date => props.onFieldChange('rotation_start_date', date)}
                                            dateFormat="d-M-Y"
                                            style={{ display: 'block' }}
                                        // onCalendarClose={handleCalendarClose}
                                        // onCalendarOpen={handleCalendarOpen}
                                        />
                                {/* <input className={`form-control`} id="rotation_start_date" type="text" placeholder={props.translations.tasks.rotation_start_date} name="name" onChange={props.onChange} value={props.task.rotation_start_date} /> */}
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div className="form-group">
                                <label htmlFor="name">{props.translations.tasks.rotation_days_count}</label>
                                <input className={`form-control`} id="name" type="text" title={"latin"} placeholder={props.translations.common.rotation_days_count} name="rotation_days_count" onChange={props.onChange} value={props.task.rotation_days_count} />
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div className="form-group">
                                <label htmlFor="name">{props.translations.tasks.times_per_day_of_task_execution}</label>
                                <input className={`form-control`} id="times_per_day_of_task_execution" type="text" placeholder={props.translations.tasks.times_per_day_of_task_execution} name="times_per_day_of_task_execution" onChange={props.onChange} value={props.task.times_per_day_of_task_execution} />
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor="parentId">{props.translations.tasks.users}</label>
                                {/* <Select name="parentId" options={autocompleteUsers}
                                    onChange={props.onChangeSelectAutocomplete} //value={selectedParent}
                                    placeholder={props.translations.tasks.users}
                                /> */}

                                <Select
                                    value={props.task.users}
                                    isMulti
                                    name="colors"
                                    options={usersOptions}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={(valueLabel) => props.onChangeSelectAutocomplete('users', valueLabel)}
                                // onChange={(values, { action, removedValue }) => props.ingredientsOnChange(values, { action, removedValue }, 'removable')}
                                />

                            </div>
                        </div>

                    </div>

                    <hr />
                    <br />

                    <div className="form-actions">
                        {props.isAdding == 1 ? '' : <button className="btn btn-danger mright10" type="button" data-toggle="modal" data-target={"#dangerModal" + props.checkpointId} > {props.translations.common.delete}</button>}
                        
                        <DeleteCheckpointModal
                            checkpointId={props.checkpointId}
                            checkpointNum={props.checkpointNum}
                            deleteCheckpoint={props.deleteCheckpoint}
                            translations={props.translations}
                        />
                         
                        <NavLink to={ADMIN_URL + 'checkpoints'}>
                            <button className="btn btn-secondary" type="button">
                                {props.translations.common.cancel}
                            </button>
                        </NavLink>

                        <button className="fright btn btn-primary" type="submit" onClick={props.onSubmit}>
                            {props.isAdding == 1 ? props.translations.common.add : props.translations.common.save}
                        </button>

                    </div>

                </div>

            </form>
        )
    }
}

export default AddEditCheckpointTaskForm;