import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './top-menu.css';
import { CirclePicker } from 'react-color';

class TopMenu extends Component {
    static propTypes = {
        onUndoClick: PropTypes.func,
        onRedoClick: PropTypes.func,
        onZoomIn: PropTypes.func,
        onZoomOut: PropTypes.func,
        onGroupClick: PropTypes.func,
        onUngroupClick: PropTypes.func,
        onColorSelect: PropTypes.func,
        onMoveBackward: PropTypes.func,
        onMoveForward: PropTypes.func,
        onSendToBack: PropTypes.func,
        onBringToFront: PropTypes.func,
        onCustomZoom: PropTypes.func,
        scale: PropTypes.number,
        currentPalette: PropTypes.array
    };

    constructor(props) {
        super(props);

        this.tempScale = this.props.scale;

        this.handleUndoClick = this.handleUndoClick.bind(this);
        this.handleRedoClick = this.handleRedoClick.bind(this);
        this.handleChangeComplete = this.handleChangeComplete.bind(this);
        this.handleZoomIn = this.handleZoomIn.bind(this);
        this.handleZoomOut = this.handleZoomOut.bind(this);
        this.handleGroupClick = this.handleGroupClick.bind(this);
        this.handleUngroupClick = this.handleUngroupClick.bind(this);
        this.handleMoveBackward = this.handleMoveBackward.bind(this);
        this.handleMoveForward = this.handleMoveForward.bind(this);
        this.handleSendToBack = this.handleSendToBack.bind(this);
        this.handleBringToFront = this.handleBringToFront.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUndoClick() {
        this.props.onUndoClick();
    }

    handleRedoClick() {
        this.props.onRedoClick();
    }

    handleGroupClick() {
        this.props.onGroupClick();
    }

    handleUngroupClick() {
        this.props.onUngroupClick();
    }

    handleMoveForward() {
        this.props.onMoveForward();
    }

    handleMoveBackward() {
        this.props.onMoveBackward();
    }

    handleBringToFront() {
        this.props.onBringToFront();
    }

    handleSendToBack() {
        this.props.onSendToBack();
    }

    handleChangeComplete(color, event) {
        this.props.onColorSelect(color.rgb);
    }

    handleZoomIn() {
        this.props.onZoomIn();
    }

    handleZoomOut() {
        this.props.onZoomOut();
    }

    handleChange(event) {
        this.tempScale = event.target.value / 100.0;
    }

    handleSubmit(event) {
        this.props.onCustomZoom(this.tempScale);
        event.preventDefault();
    }

    render() {
        const { scale, currentPalette } = this.props;
        return (
            <div id="top-bar">
                <button onClick={this.handleUndoClick}>
                    <img src="./assets/undo.svg" alt="undo" id="button-icon" />
                </button>
                <button onClick={this.handleRedoClick}>
                    <img src="./assets/redo.svg" alt="redo" id="button-icon" />
                </button>
                <button onClick={this.handleGroupClick}>
                    <img src="./assets/group.svg" alt="group" id="button-icon" />
                </button>
                <button onClick={this.handleUngroupClick}>
                    <img src="./assets/ungroup.svg" alt="ungroup" id="button-icon" />
                </button>
                <button onClick={this.handleMoveForward}>
                    <img src="./assets/upone.svg" alt="upone" id="button-icon" />
                </button>
                <button onClick={this.handleMoveBackward}>
                    <img src="./assets/backone.svg" alt="downone" id="button-icon" />
                </button>
                <button onClick={this.handleSendToBack}>
                    <img src="./assets/SendToBack.svg" alt="backall" id="button-icon" />
                </button>
                <button onClick={this.handleBringToFront}>
                    <img src="./assets/BringToFront.svg" alt="frontall" id="button-icon" />
                </button>
                <div id="color-palette">
                    <CirclePicker onChangeComplete={this.handleChangeComplete} colors={currentPalette} circleSize={20} circleSpacing={5} width='450px' />
                </div>
                <button onClick={this.handleZoomIn} id="button-icon">+</button>
                <button onClick={this.handleZoomOut} id="button-icon">-</button>
                <form id="button-icon" onSubmit={this.handleSubmit}>
                    {scale * 100.00 + "%"} <input type="text" onChange={this.handleChange} />
                </form>
            </div>
        );
    }
}

export default TopMenu;
