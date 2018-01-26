import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './top-menu.css';
import { CirclePicker } from 'react-color';

class TopMenu extends Component {
    static propTypes = {
        onUndoClick: PropTypes.func,
        onRedoClick: PropTypes.func,
        onColorSelect: PropTypes.func,
        fillColor: PropTypes.object,
        strokeColor: PropTypes.object,
        onButtonSelect: PropTypes.func,
        onAddColor: PropTypes.func,
        onRemoveColor: PropTypes.func,
        onAddPalette: PropTypes.func,
        onRemovePalette: PropTypes.func
    };

    constructor(props) {
        super(props);

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

        this.handleChange = this.handleChange.bind(this);
        this.handleButtonSelect = this.handleButtonSelect.bind(this);
    }

    handleUndoClick() {
        this.props.onUndoClick();
    }

    handleRedoClick() {
        this.props.onRedoClick();
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

    handleButtonSelect(color, button) {
        // console.log(color);
        // console.log(button);
        this.props.onButtonSelect({color, button});
    }

    render() {
        const { fillColor, strokeColor, currentPalette } = this.props;
        const fillStyle = {
            backgroundColor: `rgba(${fillColor.r}, ${fillColor.g}, ${fillColor.b}, ${fillColor.a} )` // this.props.fillColor
        };
        const strokeStyle = {
            backgroundColor: `rgba(${strokeColor.r}, ${strokeColor.g}, ${strokeColor.b}, ${strokeColor.a} )` // this.props.strokeColor
        };
        return (
            <div id="top-bar">
                <button onClick={this.handleUndoClick}>
                    <img src="./assets/undo.svg" alt="undo" id="button-icon" />
                </button>
                <button onClick={this.handleRedoClick}>
                    <img src="./assets/redo.svg" alt="redo" id="button-icon" />
                </button>

                <form id="fill-toggle" >
                    <input type="radio" name="toggle" value="fill" id="fill" defaultChecked />
                    <label htmlFor="fill" style={fillStyle} onClick={() => { this.handleButtonSelect(fillColor, "fill"); }} />
                    <p>Fill</p>
                    <span />
                    <input type="radio" name="toggle" value="stroke" id="stroke" />
                    <label htmlFor="stroke" style={strokeStyle} onClick={() => { this.handleButtonSelect(strokeColor, "stroke"); }} />
                    <p>Stroke</p>
                </form>
                <div id="color-palette">
                    <CirclePicker onChangeComplete={this.handleColorSelect} colors={currentPalette} circleSize={20} circleSpacing={5} width='450px' />
                </div>

            </div>
        );
    }
}

export default TopMenu;
