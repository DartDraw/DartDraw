import 'react-select/dist/react-select.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './color-menu.css';
import Dropdown from 'react-dropdown';
import DDColorPicker from './DDColorPicker';
import {ColorInput, ColorPicker} from 'react-colors';

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
        onChangeColorType: PropTypes.func,
        onSelectColor: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            showColorPicker: false,
            color: this.props.currentColor
        };

        this.tempOpacityValue = this.props.currentColor.a;

        this.handleUpdate = this.handleUpdate.bind(this);
        this.showColorInfo = this.showColorInfo.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleColorUpdate = this.handleColorUpdate.bind(this);
        this.handleAddColor = this.handleAddColor.bind(this);
        this.handleChangeColorType = this.handleChangeColorType.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleColorInputChange = this.handleColorInputChange.bind(this);
        this.convertRGBArrayToObj = this.convertRGBArrayToObj.bind(this);
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

    handleColorChange(colorInfo) {
        console.log(colorInfo.rgb);
        this.props.onSelectColor(colorInfo.rgb);
        // pick color
    }

    handleColorInputChange(stuff) {
        console.log("changed input from api");
        console.log(stuff);
        this.props.onSelectColor(this.convertRGBArrayToObj(stuff));
    }

    convertRGBArrayToObj(colorInfo) {
        return {r: colorInfo.rgb[0], g: colorInfo.rgb[1], b: colorInfo.rgb[2], a: colorInfo.alpha};
    }

    render() {
        const { fillColor, currentColor, colorType } = this.props;
        const currentColorStyle = {
            backgroundColor: `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${currentColor.a} )`
        };
        const inputStyles =
        {
            display: 'flex',
            flexFlow: 'row nowrap',
            fontFamily: 'Catamaran',
            margin: 0,
            padding: 0
        };

        const hexStyle = {
            width: '100px'
        };

        const CMYKEditor =
            <div id="color-input">
                <ColorPicker color={[this.props.currentColor.r, this.props.currentColor.g, this.props.currentColor.b]} onChange={this.handleColorInputChange}>
                    <ColorInput model='cmyk.c' style={inputStyles} />
                    <ColorInput model='cmyk.m' style={inputStyles} />
                    <ColorInput model='cmyk.y' style={inputStyles} />
                    <ColorInput model='cmyk.k' style={inputStyles} />
                </ColorPicker>
            </div>;

        const RGBEditor =
            <div id="color-input">
                <ColorPicker color={[this.props.currentColor.r, this.props.currentColor.g, this.props.currentColor.b]} onChange={this.handleColorInputChange}>
                    <ColorInput model='rgb.r' style={inputStyles} />
                    <ColorInput model='rgb.g' style={inputStyles} />
                    <ColorInput model='rgb.b' style={inputStyles} />
                </ColorPicker>
            </div>;

        const HSVEditor =
            <div id="color-input">
                <ColorPicker color={[this.props.currentColor.r, this.props.currentColor.g, this.props.currentColor.b]} onChange={this.handleColorInputChange}>
                    <ColorInput model='hsv.h' style={inputStyles} />
                    <ColorInput model='hsv.s' style={inputStyles} />
                    <ColorInput model='hsv.v' style={inputStyles} />
                </ColorPicker>
            </div>;

        const HEXEditor =
            <div id="color-input">
                <ColorPicker color={[this.props.currentColor.r, this.props.currentColor.g, this.props.currentColor.b]} onChange={this.handleColorInputChange}>
                    <ColorInput model='hex' style={hexStyle} />
                </ColorPicker>
            </div>;

        let colorPicker = null;
        if (!this.state.showColorPicker) {
            colorPicker = <div />;
        } else {
            colorPicker = <div id="color-picker"><div className="arrow-up" /><DDColorPicker onChangeComplete={this.handleColorChange} color={this.props.currentColor} /></div>;
        }
        let colorInput = null;
        if (this.props.colorType === "CMYK") {
            colorInput = CMYKEditor;
        } else if (this.props.colorType === "RGB") {
            colorInput = RGBEditor;
        } else if (this.props.colorType === "HSV") {
            colorInput = HSVEditor;
        } else {
            colorInput = HEXEditor;
        }

        let colorOptions = [{value: 'RGB', label: 'RGB'}, {value: 'CMYK', label: 'CMYK'}, {value: 'HSV', label: 'HSV'}, {value: 'HEX', label: 'HEX'}];

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
                <div className="horz-div" />
            </div>
        );
    }
}

export default ColorMenu;
