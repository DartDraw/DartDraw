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

// move the below to a React Component
// const fs = window.require('fs');

// export const OPEN_FILE = 'OPEN_FILE';

// function openFile(data) {
// 	return { type: OPEN_FILE, payload: { data } };
// }

// const { ipcRenderer } = window.require('electron');

// ipcRenderer.on('file-save', (event, arg) => {
// 	let state = store.getState();
// 	let stateString = JSON.stringify(state);
// 	event.sender.send('file-save', stateString);
// });

// ipcRenderer.on('file-open', (event, filename) => {
// 	fs.readFile(filename, 'utf-8', (err, data) => {
//         if(err){
//             alert("An error ocurred reading the file :" + err.message);
//             return;
//         }
//         // Change how to handle the file content
//         store.dispatch(openFile(data));
//     });
// });

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
