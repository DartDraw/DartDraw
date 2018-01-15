import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppContainer from './AppContainer';
import registerServiceWorker from './registerServiceWorker';
import { deepCopy } from './reducers/utilities/object';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers/index';

let store = createStore(reducer);
const fs = window.require('fs');

export const SET_BACKGROUND_COLOR = 'SET_BACKGROUND_COLOR';
export const OPEN_FILE = 'OPEN_FILE';

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
