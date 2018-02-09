import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './palette-menu.css';
import ColorSquare from './ColorSquare';

class PaletteEditor extends Component {
    static propTypes = {
        currentColor: PropTypes.object,
        palettes: PropTypes.array,
        currentPalette: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            colorList: []
        };

        this.handleColorClick = this.handleColorClick.bind(this);
        this.getCurrentColorList = this.getCurrentColorList.bind(this);
    }

    onComponentWillMount() {
        this.setState({colorList: this.getCurrentColorList()});
    }

    handleColorClick(color) {
        console.log(color);
        console.log(this.state.colorList);
        console.log(this.props.palettes['Default'].colors);
    }

    getCurrentColorList() {
        const {palettes, currentPalette} = this.props;
        palettes.map((palette) => {
            if (palette.name === currentPalette) {
                console.log(palette.colors);
                return palette.colors;
            }
        });
    }

    render() {
        // const colorList = this.getCurrentColorList();
        const palette = this.state.colorList.map((color) =>
            <ColorSquare color={color} />
        );
        return (
            <div className="color-editor">
                <h1>Palette test:</h1>
                <div>
                    { palette }
                    <ColorSquare color={this.props.currentColor} colorClick={this.handleColorClick} />
                </div>
            </div>
        );
    }
}

export default PaletteEditor;
