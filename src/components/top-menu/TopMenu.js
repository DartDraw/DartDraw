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
        onPaletteSelect: PropTypes.func,
        onAddColor: PropTypes.func,
        onRemoveColor: PropTypes.func,
        onAddPalette: PropTypes.func,
        onRemovePalette: PropTypes.func,
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
        this.handleColorSelect = this.handleColorSelect.bind(this);
        this.handlePaletteSelect = this.handlePaletteSelect.bind(this);
        this.handleAddColor = this.handleAddColor.bind(this);
        this.handleRemoveColor = this.handleRemoveColor.bind(this);
        this.handleAddPalette = this.handleAddPalette.bind(this);
        this.handleRemovePalette = this.handleRemovePalette.bind(this);
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

    handleColorSelect(color, event) {
        this.props.onColorSelect(color.rgb);
    }

    handlePaletteSelect(event) {
        // this.props.onPaletteSelect(paletteName);
        // where paletteName is a string (verified on backend)
    }

    handleAddColor(color, event) {
        this.props.onAddColor(color.rgb); // new color added to the end of the current palette
    }

    handleRemoveColor(color, event) {
        this.props.onRemoveColor(color.rgb); // removed from current palette
    }

    handleAddPalette(event) {
        // this.props.onAddPalette(paletteName, paletteColors);
        // where paletteName is a string and paletteColors is an array
        // of rgba objects...
        // ex. paletteColors = [{ r: 33, g: 150, b: 243, a: 1 }, { r: 42, g: 250, b: 243, a: 0.5 }]
        // The paletteType is always 'HEX' - we can change that.

        // alternatively you could just create a new empty palette and then
        // add colors to it one by one - up to you! Just let me know if you need
        // me to change the backend (or you can just do it yourself!)
    }

    handleRemovePalette(event) {
        // this.props.onRemovePalette(paletteName);
        // where paletteName is a string

        // I wrote the backend so you can't delete "Default"
        // and if you delete the currentPalette, then
        // currentPalette = "Default"
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
                    <CirclePicker onChangeComplete={this.handleColorSelect} colors={currentPalette} circleSize={20} circleSpacing={5} width='450px' />
                </div>
                <button onClick={this.handleZoomIn} id="button-icon">+</button>
                <button onClick={this.handleZoomOut} id="button-icon">-</button>
                <form id="button-icon" onSubmit={this.handleSubmit}>
                    {Math.round(scale * 100) + "%"} <input type="text" onChange={this.handleChange} />
                </form>
            </div>
        );
    }
}

export default TopMenu;
