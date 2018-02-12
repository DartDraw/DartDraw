import 'react-select/dist/react-select.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './color-menu.css';
import Dropdown from 'react-dropdown';
import ColorPicker from 'react-color-picker';

class ColorMenu extends Component {
    static propTypes = {
        fillColor: PropTypes.object,
        currentColor: PropTypes.object,
        onUpdateOpacity: PropTypes.func,
        onColorUpdate: PropTypes.func,
        palettes: PropTypes.object,
        currentPalette: PropTypes.string,
        onAddColor: PropTypes.func,
        colorType: PropTypes.string,
        onChangeColorType: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            showColorPicker: false
        };

        this.tempOpacityValue = this.props.currentColor.a;

        this.handleUpdate = this.handleUpdate.bind(this);
        this.showColorInfo = this.showColorInfo.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleColorUpdate = this.handleColorUpdate.bind(this);
        this.handleAddColor = this.handleAddColor.bind(this);
        this.handleChangeColorType = this.handleChangeColorType.bind(this);
    }

    handleUpdate(event) {
        console.log(event.target.value);
        // event.value;
    }

    showColorInfo(event) {
        console.log(this.props.currentColor);
        this.setState({showColorPicker: !this.state.showColorPicker});
        // this.props.onAddColor(this.props.currentColor);
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

    handleChangeColorType(event) {
        console.log(event.value);
        this.props.onChangeColorType(String(event.value));
    }

    render() {
        const { fillColor, currentColor, colorType } = this.props;
        const currentColorStyle = {
            backgroundColor: `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${currentColor.a} )`
        };

        const CMYKEditor =
            <div id="color-input">
                <p>C: <input type="text" defaultValue={fillColor.r} onChange={(e) => { this.handleColorUpdate("R", e); }} /> </p>
                <p>M: <input type="text" defaultValue={fillColor.g} onChange={(e) => { this.handleColorUpdate("G", e); }} /> </p>
                <p>Y: <input type="text" defaultValue={fillColor.b} onChange={(e) => { this.handleColorUpdate("B", e); }} /> </p>
                <p>K: <input type="text" defaultValue={fillColor.b} onChange={(e) => { this.handleColorUpdate("B", e); }} /> </p>
            </div>;

        const RGBEditor =
            <div id="color-input">
                <p>R: <input type="text" defaultValue={fillColor.r} onChange={(e) => { this.handleColorUpdate("R", e); }} /> </p>
                <p>G: <input type="text" defaultValue={fillColor.g} onChange={(e) => { this.handleColorUpdate("G", e); }} /> </p>
                <p>B: <input type="text" defaultValue={fillColor.b} onChange={(e) => { this.handleColorUpdate("B", e); }} /> </p>
            </div>;

        let colorPicker = null;
        if (this.state.showColorPicker) {
            colorPicker = <div />;
        } else {
            colorPicker = <div id="color-picker" />;
        }
        let colorInput = null;
        if (this.props.colorType === "CMYK") {
            colorInput = CMYKEditor;
        } else {
            colorInput = RGBEditor;
        }

        let colorOptions = [{value: 'RGB', label: 'RGB'}, {value: 'CMYK', label: 'CMYK'}];

        return (
            <div className="color-editor">
                <div id="inline-apart">
                    <h1>Color Editor</h1>

                </div>
                <div id="inline-close">
                    <div style={currentColorStyle} id="current-color-display" onClick={this.showColorInfo} />
                    {colorPicker}
                    <Dropdown id="dropwdown" options={colorOptions} onChange={this.handleChangeColorType} value={colorType} placeholder={colorType} />
                    <form id="opacity-form" onSubmit={this.handleSubmit}>
                        <label>Opacity:</label>
                        <input className="range-input" type="range" min="1" max="100" value={this.tempValue} defaultValue="100" step="1" onChange={this.handleChange} />
                        <input type="text" value={this.tempOpacityValue * 100.0} onChange={this.handleChange} />
                    </form>
                </div>
                <div id="inline-close">
                    { colorInput }
                    <button id="basic-button" onClick={this.handleAddColor}>Add To Palette</button>
                </div>
            </div>
        );
    }
}

export default ColorMenu;
