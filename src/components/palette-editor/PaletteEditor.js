import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './palette-menu.css';
import ColorSquare from './ColorSquare';
import Dropdown from 'react-dropdown';
import Select from 'react-select';

class PaletteEditor extends Component {
    static propTypes = {
        currentColor: PropTypes.object,
        palettes: PropTypes.object,
        currentPalette: PropTypes.string,
        onSelectColor: PropTypes.func,
        onSelectPalette: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            colorList: []
        };

        this.handleColorClick = this.handleColorClick.bind(this);
        this.handleChangePalette = this.handleChangePalette.bind(this);
    }

    handleColorClick(color) {
        console.log(Object.keys(this.props.palettes));
        this.props.onSelectColor(color);
    }

    handleChangePalette(paletteName) {
        console.log(paletteName);
        this.props.onSelectPalette(paletteName.value);
    }

    render() {
        // const colorList = this.getCurrentColorList();
        const { palettes, currentPalette } = this.props;
        const colorList = palettes[currentPalette].colors;
        const palette = colorList.map((color) =>
            <ColorSquare color={color} colorClick={this.handleColorClick} />
        );
        return (
            <div className="color-editor">
                <h1>Current Palette:</h1>
                <Dropdown id="dropwdown" options={Object.keys(palettes)} onChange={(e) => { this.handleChangePalette(e); }} value={currentPalette} placeholder="Select an option" />
                <div id="palette">
                    { palette }
                </div>
            </div>
        );
    }
}

export default PaletteEditor;
