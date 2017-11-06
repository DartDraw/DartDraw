import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BackgroundLayer extends Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        fill: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.handleCanvasColorChange = this.handleCanvasColorChange.bind(this);
    }

    handleCanvasColorChange() {
        window.require('electron').ipcRenderer.on('canvasColorChange', (event, message) => {
            console.log(message); // returns color to change canvas to
            // backgroundColor = message;
            // console.log(backgroundColor);
            return message;
        });
    }

    componentWillUpdate() {
        this.props.fill = this.handleCanvasColorChange();
    }

    render() {
        const { width, height, fill } = this.props;

        return (
            <rect width={width} height={height} fill={fill} />
        );
    }
}

export default BackgroundLayer;
