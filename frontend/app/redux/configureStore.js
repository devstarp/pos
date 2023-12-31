/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import { routerMiddleware } from 'connected-react-router/immutable';
// import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
// import { persistReducer, persistStore } from 'redux-persist';
import { persistReducer } from 'redux-persist';
import { persistStore, getStoredState } from 'redux-persist-immutable';
import storage from 'redux-persist/lib/storage';
import createReducer from './reducers';
import { createHashHistory } from 'history';

export const history = createHashHistory();
 
// const persistConfig = {
//   key: 'root',
//   storage: storage,
//   // blacklist: ['auth'],
//   // transforms: [SetTransform],
// };
const persistConfig = {
  key: 'root',
  storage,
  // blacklist: ['auth'],
  // transforms: [SetTransform],
};
 
export let staticStore = null;
 
 
export default function configureStore(initialState = {}, history) {
  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [routerMiddleware(history)];
 
  const enhancers = [applyMiddleware(...middlewares)];
 
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle, indent */
   const composeEnhancers = process.env.NODE_ENV !== 'production'
     && typeof window === 'object'
     && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
       ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
           // Prevent recomputing reducers for `replaceReducer`
           shouldHotReload: false,
         })
       : compose;
   /* eslint-enable */
  const store = createStore(
    // createReducer(),
    persistReducer(persistConfig, createReducer()),
    fromJS(initialState),
    composeEnhancers(...enhancers),
  );
 
  // Extensions
  store.injectedReducers = {}; // Reducer registry
 
  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(persistReducer(persistConfig, createReducer(store.injectedReducers)));
    });
  }
 
  const persistor = persistStore(store);
  staticStore = store;
  return { store, persistor };
  // return store;
}

 