import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import usersReducer from './usersReducer';
import messagesReducer from './../components/messages/messages.reducer';
import languageReducer from './languageReducer';
import { connectRouter } from 'connected-react-router'
import authReducer from '../reducers/authReducer';
import placesReducer from './../components/places/reducers/places.reducer';
import clientsReducer from './../components/clients/reducers/clients.reducer';
import loadingReducer from './../components/common/loading/loading.reducer';
import adminReducer from './adminReducer';

import tasksReducer from '../components/tasks/reducers/tasks.reducer';
import checkpointsReducer from '../components/checkpoints/reducers/checkpoints.reducer';

const createRootReducer = (history) => combineReducers({
  tasks: tasksReducer,
  checkpoints: checkpointsReducer,
  users: usersReducer,
  messages: messagesReducer,
  lang: languageReducer,
  auth: authReducer,
  places: placesReducer,
  clients: clientsReducer,
  loading: loadingReducer,
  router: connectRouter(history),
  routing: routerReducer,
  admin: adminReducer,
})

export default createRootReducer