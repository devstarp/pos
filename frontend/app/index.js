import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { getStoredState } from 'redux-persist-immutable';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import App from './containers/App/index';
import configureStore, {history } from './redux/configureStore';
import './assets/styles/app.global.css'
import './assets/styles/dark-theme.css'

const MOUNT_NODE = document.getElementById('root');

const renderDom= async(RootApp)=>{
  let initialStore = await getStoredState();
  if (initialStore && typeof initialStore.toJS === 'function') {
    initialStore = initialStore.toJS();
  }
  const {store} = configureStore(initialStore);
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <RootApp />
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    MOUNT_NODE
  );
}
renderDom(App)

if (module.hot) {
  module.hot.accept('./containers/App/index', () => {
    const NextRoot = require('./containers/App/index'); // eslint-disable-line global-require
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    renderDom(NextRoot)
  });
}
