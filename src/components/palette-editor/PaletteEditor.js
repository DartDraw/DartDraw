import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './palette-menu.css';
import ColorSquare from './ColorSquare';

class PaletteEditor extends Component {
    static propTypes = {
        currentColor: PropTypes.object,
        palettes: PropTypes.array
    };

    constructor(props) {
        super(props);

        this.handleColorClick = this.handleColorClick.bind(this);
    }

    handleColorClick(color) {
        console.log(color);
    }

    render() {
        // paletteTest = <div>{}</div>;
        return (
            <div className="color-editor">
                <h1>Palette test:</h1>
                <p>{this.props.currentColor.r}</p>
                <div>
                    <ColorSquare color={this.props.currentColor} colorClick={this.handleColorClick} />
                </div>
            </div>
        );
    }
}

export default PaletteEditor;
