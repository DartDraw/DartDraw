import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './color-menu.css';
import ColorSquare from './ColorSquare';
import ColorList from './ColorList';

class ColorMenu extends Component {
    static propTypes = {
        fillColor: PropTypes.object,
        currentColor: PropTypes.object,
        onUpdateOpacity: PropTypes.func,
        onColorUpdate: PropTypes.func,
        palettes: PropTypes.object,
        currentPalette: PropTypes.string,
        onAddColor: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.tempOpacityValue = this.props.currentColor.a;

        this.handleUpdate = this.handleUpdate.bind(this);
        this.showColorInfo = this.showColorInfo.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleColorUpdate = this.handleColorUpdate.bind(this);
        this.handleAddColor = this.handleAddColor.bind(this);
    }

    handleUpdate(event) {
        console.log(event.target.value);
        // event.value;
    }

    showColorInfo(event) {
        console.log(this.props.currentColor);
        this.props.onAddColor(this.props.currentColor);
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
        console.log("this is supposed to add a color");
        console.log(this.props.currentColor);
        console.log(this.props.palettes);

        this.props.onAddColor(this.props.currentColor);
    }

    render() {
        const { fillColor, currentColor, palettes, currentPalette } = this.props;
        const currentColorStyle = {
            backgroundColor: `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${currentColor.a} )`
        };
        // let paletteTest = null;
        // let paletteColors = null;
        // palettes.map((palette) => {
        //     if (palette.name === currentPalette) {
        //         paletteColors = <ColorList colorList={palette.colors} />;
        //     }
        // });
        let paletteColors = <p>temp placeholder</p>;

        // paletteTest = <div>{}</div>;

        return (
            <div className="color-editor">
                <h1>Color Editor</h1>
                {paletteColors}
                <form onSubmit={this.handleSubmit}>
                    <input type="range" min="1" max="100" value={this.tempValue} defaultValue="100" step="1" onChange={this.handleChange} />
                    <input type="text" value={this.tempOpacityValue * 100.0} onChange={this.handleChange} />
                </form>
                <div style={currentColorStyle} id="current-color-display" onClick={this.showColorInfo} />
                <div id="color-input">
                    <p>R: <input type="text" defaultValue={fillColor.r} onChange={(e) => { this.handleColorUpdate("R", e); }} /> </p>
                    <p>G: <input type="text" defaultValue={fillColor.g} onChange={(e) => { this.handleColorUpdate("G", e); }} /> </p>
                    <p>B: <input type="text" defaultValue={fillColor.b} onChange={(e) => { this.handleColorUpdate("B", e); }} /> </p>
                </div>
                <button id="basic-button" onClick={this.handleAddColor}>Add To Current Palette</button>
                <div>
                    <h1>Palettes</h1>

                </div>
            </div>
        );
    }
}

export default ColorMenu;
