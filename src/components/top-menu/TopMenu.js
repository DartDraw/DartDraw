import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './top-menu.css';
import { CirclePicker } from 'react-color';

const currentPalette = ["#ffffff","#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548"];

class TopMenu extends Component {
    static propTypes = {
        onUndoClick: PropTypes.func,
        onRedoClick: PropTypes.func,
        onGroupClick: PropTypes.func,
        onColorSelect: PropTypes.func,
        onSendToBack: PropTypes.func,
        onBringToFront: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleUndoClick = this.handleUndoClick.bind(this);
        this.handleRedoClick = this.handleRedoClick.bind(this);
        this.handleChangeComplete = this.handleChangeComplete.bind(this);
        this.handleGroupClick = this.handleGroupClick.bind(this);
        this.handleSendToBack = this.handleSendToBack.bind(this);
        this.handleBringToFront = this.handleBringToFront.bind(this);
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

    handleBringToFront() {
        this.props.onBringToFront();
    }

    handleSendToBack() {
        this.props.onSendToBack();
    }

    handleChangeComplete(color, event) {
        this.props.onColorSelect(color.rgb);
    }

    render() {
        return (
            <div id="top-bar">
                <button onClick={this.handleUndoClick}>
                    <img src="./assets/004-undo.svg" alt="undo" id="button-icon" />
                </button>
                <button onClick={this.handleRedoClick}>
                    <img src="./assets/003-redo.svg" alt="redo" id="button-icon" />
                </button>
                <button onClick={this.handleGroupClick}>
                  <img src="./assets/005-group.svg" alt="group" id="button-icon" />
                </button>
                <button onClick={this.handleSendToBack}>
                  <img src="./assets/007-SendToBack.svg" alt="backall" id="button-icon" />
                </button>
                <button onClick={this.handleBringToFront}>
                  <img src="./assets/006-BringToFront.svg" alt="frontall" id="button-icon" />
                </button>
                <div id="color-palette">
                    <CirclePicker onChangeComplete={this.handleChangeComplete} colors={currentPalette} circleSize={20} circleSpacing={5} width='450px' />
                </div>

            </div>
        );
    }
}

export default TopMenu;
