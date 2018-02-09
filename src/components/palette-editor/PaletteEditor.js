import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './palette-menu.css';
import ColorSquare from './ColorSquare';

class PaletteEditor extends Component {
    static propTypes = {
        currentColor: PropTypes.object,
        palettes: PropTypes.object,
        currentPalette: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            colorList: []
        };

        this.handleColorClick = this.handleColorClick.bind(this);
    }

    handleColorClick(color) {
        console.log("w");
        console.log(color);
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
                <h1>Palette test:</h1>
                <div id="palette">
                    { palette }
                    <ColorSquare color={this.props.currentColor} />
                </div>
            </div>
        );
    }
}

export default PaletteEditor;
