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

function setBackgroundColor(color) {
    return { type: SET_BACKGROUND_COLOR, payload: { color } };
}

function openFile(data) {
	return { type: OPEN_FILE, payload: { data } };
}

const { ipcRenderer } = window.require('electron');

ipcRenderer.send('async', true);
ipcRenderer.on('async', (event, color) => {
	store.dispatch(setBackgroundColor(color));
});

ipcRenderer.on('file-save', (event, arg) => {
	let state = store.getState();
	let stateString = JSON.stringify(state);
	event.sender.send('file-save', stateString);
});

ipcRenderer.on('file-open', (event, filename) => {
	fs.readFile(filename, 'utf-8', (err, data) => {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        console.log('opening a file');

        // Change how to handle the file content
        store.dispatch(openFile(data));
    });
});

ipcRenderer.on('alert', (event, arg) => {
	alert(arg);
});

// const {ipcRenderer} = window.require('electron');
// ipcRenderer.on('loaded-from-file', (event, arg) => {
	// const stateCopy = deepCopy(store.getState());
	// store.dispatch(setStateFromLoad(stateCopy, arg));
// 	console.log(arg);
// 	// event.sender.send('loaded-from-file', "hello from your new renderer process!");
// });

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
