import React, { Component } from 'react';
import PropTypes from 'prop-types';

class IpcMiddleware extends Component {
    static propTypes = {
        onFileSave: PropTypes.func,
        onFileOpen: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.handleFileSave = this.handleFileSave.bind(this);
        this.handleFileOpen = this.handleFileOpen.bind(this);
    }

    componentDidMount() {
        const fs = window.require('fs');
        const { ipcRenderer } = window.require('electron');

        ipcRenderer.on('file-save', (event, arg) => {
            this.handleFileSave(event);
        });

        ipcRenderer.on('file-open', (event, data) => {
            this.handleFileOpen(data);
        });

        ipcRenderer.on('alert', (event, message) => {
            alert(message);
        });

        ipcRenderer.on('error', (event, err) => {
            alert(err);
        });
    }

    handleFileSave(event) {
        this.props.onFileSave(event);
    }

    handleFileOpen(data) {
        this.props.onFileOpen(data);
    }

    render() {
        return null;
    }
}

export default IpcMiddleware;
