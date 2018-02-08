import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './palette-menu.css';

class PaletteEditor extends Component {
    static propTypes = {
        fillColor: PropTypes.object,
        currentColor: PropTypes.object,
        onUpdateOpacity: PropTypes.func,
        onColorUpdate: PropTypes.func,
        palettes: PropTypes.array,
        currentPalette: PropTypes.string,
        onAddColor: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            r: '100',
            g: '100',
            b: '100'
        };

        this.tempOpacityValue = this.props.currentColor.a;

        this.handleUpdate = this.handleUpdate.bind(this);
        this.showColorInfo = this.showColorInfo.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleColorUpdate = this.handleColorUpdate.bind(this);
        this.renderColorsInPalette = this.renderColorsInPalette.bind(this);
        this.renderPalette = this.renderPalette.bind(this);
        this.handleAddColor = this.handleAddColor.bind(this);
    }

    handleUpdate(event) {
        console.log(event.target.value);
        // event.value;
    }

    showColorInfo(event) {
        console.log(this.props.currentColor);
    }

    handleChange(event) {
        this.tempOpacityValue = event.target.value / 100.0;
        this.props.onUpdateOpacity(event.target.value / 100.0);
        console.log(this.tempOpacityValue);
        // console.log(event);
    }

    handleSubmit(event) {
        this.tempOpacityValue = event.target.value / 100.0;
        event.preventDefault();
    }

    handleColorUpdate(colorPart, event) {
        let newValue = event.target.value;
        if (colorPart === "R") {
            this.setState({r: event.target.value});
        } else if (colorPart === "G") {
            this.setState({g: event.target.value});
        } else {
            this.setState({b: event.target.value});
        }
        this.props.onColorUpdate(colorPart, newValue);
        console.log(event.target.value);
        console.log(colorPart);
    }

    handleAddColor() {
        console.log(this.state);

        this.props.onAddColor(this.state);
    }

    renderColorsInPalette(paletteColors) {
        let color = paletteColors[0];
        const paletteColorStyle = {
            backgroundColor: paletteColors[0]
        };
        console.log("what even are palette colors");
        console.log(paletteColors[0]);
        return (<div style={paletteColorStyle} id="current-color-display" />);
    }

    renderPalette(paletteName) {

    }

    render() {
        // paletteTest = <div>{}</div>;

        return (
            <div className="color-editor">
                <h1>Palette test:</h1>
                <p>{this.props.currentColor.r}</p>
            </div>
        );
    }
}

export default PaletteEditor;
