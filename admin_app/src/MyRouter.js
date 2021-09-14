import React from 'react';
import { Switch, Route, Router, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { history } from './store'

//SUPER ADMIN
//PLACES
import SetCurrPlacePage from './components/places/components/SetCurrPlacePage';

// Users
import ListUsersPage from './components/users/ListUsersPage';
import ListRegisteredUsersPage from './components/users/registered/ListRegisteredUsersPage';
import AddUserPage from './components/users/AddUserPage';
import EditUserPage from './components/users/EditUserPage';
// Orders
// import ListAllOrdersPage from './components/orders/ListAllOrdersPage';

import LoginPage from './components/login/Login';
import PrivateRoute from './utils/PrivateRoute';

// PLACES
import ListPlacesPage from './components/places/components/ListPlacesPage';
import AddPlacePage from './components/places/components/AddPlacePage';
import EditPlacePage from './components/places/components/EditPlacePage';

// CLIENTS
import ListClientsPage from './components/clients/components/ListClientsPage';
import AddClientPage from './components/clients/components/AddClientPage';
import EditClientPage from './components/clients/components/EditClientPage';

import ListTasksPage from './components/tasks/components/ListTasksPage';
import AddTaskPage from './components/tasks/components/AddTaskPage';
import EditTaskPage from './components/tasks/components/EditTaskPage';

import ListCheckpointTasksForUserPage from './components/tasks/components/scan/ListCheckpointTasksForUserPage';
import ListUserTasksPage from './components/tasks/components/userTasks/ListUserTasksPage';

// Checkpoints
import ListCheckpointsPage from './components/checkpoints/components/ListCheckpointsPage';
import AddCheckpointPage from './components/checkpoints/components/AddCheckpointPage';
import EditCheckpointPage from './components/checkpoints/components/EditCheckpointPage';
import ListCheckpointTasks from './components/checkpoints/components/tasks/ListCheckpointTasks';
import AddCheckpointTaskPage from './components/checkpoints/components/tasks/AddCheckpointTask';
import EditCheckpointTaskPage from './components/checkpoints/components/tasks/EditCheckpointTaskPage';

const MyRouter = (props) => (
    <Router history={history}>
        <Switch>
            <Route exact path='/admin/login' component={LoginPage} />

            <PrivateRoute exact path='/my-tasks' component={ListUserTasksPage} />
            <PrivateRoute exact path='/tasks/t/:token' component={ListCheckpointTasksForUserPage} />

            <PrivateRoute exact path='/admin/tasks' component={ListTasksPage} />
            <PrivateRoute exact path='/admin/tasks/add' component={AddTaskPage} />
            <PrivateRoute exact path='/admin/tasks/edit/:id' component={EditTaskPage} />

            <PrivateRoute exact path='/admin/checkpoints' component={ListCheckpointsPage} />
            <PrivateRoute exact path='/admin/checkpoints/add' component={AddCheckpointPage} />
            <PrivateRoute exact path='/admin/checkpoints/edit/:id' component={EditCheckpointPage} />
            <PrivateRoute exact path='/admin/checkpoints/:id/tasks' component={ListCheckpointTasks} />
            <PrivateRoute exact path='/admin/checkpoints/:id/tasks/add' component={AddCheckpointTaskPage} />
            <PrivateRoute exact path='/admin/checkpoints/:id/tasks/:taskId/edit' component={EditCheckpointTaskPage} />


            {/* SUPER_ADMIN */}
            {/* PLACES */}
            <PrivateRoute exact path='/admin/places/current' component={SetCurrPlacePage} />
            <PrivateRoute exact path='/admin/places' component={ListPlacesPage} />
            <PrivateRoute exact path='/admin/places/add' component={AddPlacePage} />
            <PrivateRoute exact path='/admin/places/edit/:id' component={EditPlacePage} />

            {/* CLIENTS */}
            <PrivateRoute exact path='/admin/clients' component={ListClientsPage} />
            <PrivateRoute exact path='/admin/clients/add' component={AddClientPage} />
            <PrivateRoute exact path='/admin/clients/edit/:id' component={EditClientPage} />

            {/* Users */}
            <PrivateRoute exact path='/admin/users' component={ListUsersPage} />
            <PrivateRoute exact path='/admin/users/registered' component={ListRegisteredUsersPage} />
            <PrivateRoute exact path='/admin/users/add' component={AddUserPage} />
            <PrivateRoute exact path='/admin/users/edit/:id' component={EditUserPage} />
    
        </Switch>
    </Router>
)

const mapStateToProps = (state, dispatch) => {
    return {
        userRole: state.auth.user.role || null,
    }
};

export default connect(mapStateToProps, {})(MyRouter);
