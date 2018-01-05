import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BackgroundLayer extends Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        fill: PropTypes.string,
        onCanvasColorChange: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.handleCanvasColorChange = this.handleCanvasColorChange.bind(this);
    }

    componentDidMount() {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.on('canvasColorChange', (event, color) => {
            this.handleCanvasColorChange(color);
        });
    }

    handleCanvasColorChange(color) {
        this.props.onCanvasColorChange(color);
    }

    render() {
        const { width, height, fill } = this.props;
        return (
            <rect width={width} height={height} fill={fill} />
        );
    }
}

export default BackgroundLayer;
