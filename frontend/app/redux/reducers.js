/**
 * Combine all reducers in this file and export the combined reducers.
 */
import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';
import history from '../utils/history';
import category from './slices/category'
import product from './slices/product'
import supplier from './slices/supplier'
import customer from './slices/customer'
import auth from './slices/auth'
import purchase from './slices/purchase'
import sale from './slices/sale'
import employee from './slices/employee'
import department from './slices/department'

export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    ...injectedReducers,
    router: connectRouter(history),
    auth, 
    category,
    product,
    supplier,
    purchase,
    customer,
    employee,
    department,
    sale
  });

  // Wrap the root reducer and return a new root reducer with router state
  const mergeWithRouterState = connectRouter(history);

  return mergeWithRouterState(rootReducer);
}
