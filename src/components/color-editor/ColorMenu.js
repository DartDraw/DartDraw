import 'react-select/dist/react-select.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './color-menu.css';
import DDColorPicker from './DDColorPicker';
import {ColorInput, ColorPicker} from 'react-colors';
import { Select } from '../ui';
import { SwatchesPicker, CompactPicker } from 'react-color';
import ColorList from './ColorList';
import { GRID_PALETTE } from '../../constants';

class ColorMenu extends Component {
    static propTypes = {
        fillColor: PropTypes.object,
        currentColor: PropTypes.object,
        onUpdateOpacity: PropTypes.func,
        palettes: PropTypes.object,
        currentPalette: PropTypes.string,
        onAddColor: PropTypes.func,
        colorType: PropTypes.string,
        onChangeColorType: PropTypes.func,
        onSelectColor: PropTypes.func,
        onSetPickerType: PropTypes.func,
        pickerType: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            showColorPicker: false,
            color: this.props.currentColor,
            showColorEditor: true
        };

        this.tempOpacityValue = this.props.currentColor.a;

        this.showColorInfo = this.showColorInfo.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddColor = this.handleAddColor.bind(this);
        this.handleChangeColorType = this.handleChangeColorType.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleColorInputChange = this.handleColorInputChange.bind(this);
        this.convertRGBArrayToObj = this.convertRGBArrayToObj.bind(this);
        this.toggleColorEditor = this.toggleColorEditor.bind(this);
        this.handlePickerRender = this.handlePickerRender.bind(this);
        this.handlePickerTypeChange = this.handlePickerTypeChange.bind(this);
    }

    showColorInfo(event) {
        this.setState({showColorPicker: !this.state.showColorPicker});
    }

    handleChange(event) {
        this.tempOpacityValue = event.target.value / 100.0;
        this.props.onUpdateOpacity(event.target.value / 100.0);
    }

    handleSubmit(event) {
        this.tempOpacityValue = event.target.value / 100.0;
        event.preventDefault();
    }

    handleAddColor() {
        this.setState({showColorPicker: false});
        this.props.onAddColor(this.props.currentColor);
    }

    handleChangeColorType(value) {
        this.props.onChangeColorType(String(value));
    }

    handleColorChange(colorInfo) {
        console.log("what is this color info stuff");
        console.log(colorInfo);
        this.props.onSelectColor(colorInfo.rgb);
    }

    handleColorInputChange(stuff) {
        this.props.onSelectColor(this.convertRGBArrayToObj(stuff));
    }

    handlePickerTypeChange(pickerType) {
        this.props.onSetPickerType(pickerType);
    }

    convertRGBArrayToObj(colorInfo) {
        return {r: colorInfo.rgb[0], g: colorInfo.rgb[1], b: colorInfo.rgb[2], a: colorInfo.alpha};
    }

    handlePickerRender() {
        if (this.props.pickerType === 'Gradient') {
            return <DDColorPicker onChangeComplete={this.handleColorChange} color={this.props.currentColor} />;
        } else {
            return <ColorList colorList={GRID_PALETTE} />;
        }
    }

    toggleColorEditor() {
        this.setState({showColorEditor: !this.state.showColorEditor});
    }

    render() {
        const { currentColor, colorType } = this.props;
        const currentColorStyle = {
            backgroundColor: `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${currentColor.a} )`
        };
        const rowStyle = { flex: 1, display: 'flex', flexDirection: 'row' };
        const inputStyles = {
            display: 'flex',
            fontFamily: 'Catamaran',
            width: 50,
            margin: 0,
            padding: 0
        };

        const hexStyle = {
            width: '100px'
        };

        const CMYKEditor =
            <ColorPicker color={[this.props.currentColor.r, this.props.currentColor.g, this.props.currentColor.b]} onChange={this.handleColorInputChange} style={rowStyle}>
                <ColorInput model='cmyk.c' style={inputStyles} />
                <ColorInput model='cmyk.m' style={inputStyles} />
                <ColorInput model='cmyk.y' style={inputStyles} />
                <ColorInput model='cmyk.k' style={inputStyles} />
            </ColorPicker>;

        const RGBEditor =
            <ColorPicker color={[this.props.currentColor.r, this.props.currentColor.g, this.props.currentColor.b]} onChange={this.handleColorInputChange} style={rowStyle}>
                <ColorInput model='rgb.r' style={inputStyles} />
                <ColorInput model='rgb.g' style={inputStyles} />
                <ColorInput model='rgb.b' style={inputStyles} />
            </ColorPicker>;

        const HSVEditor =
            <ColorPicker color={[this.props.currentColor.r, this.props.currentColor.g, this.props.currentColor.b]} onChange={this.handleColorInputChange} style={rowStyle}>
                <ColorInput model='hsv.h' style={inputStyles} />
                <ColorInput model='hsv.s' style={inputStyles} />
                <ColorInput model='hsv.v' style={inputStyles} />
            </ColorPicker>;

        const HEXEditor =
            <ColorPicker color={[this.props.currentColor.r, this.props.currentColor.g, this.props.currentColor.b]} onChange={this.handleColorInputChange} style={rowStyle}>
                <ColorInput model='hex' style={hexStyle} />
            </ColorPicker>;

        let colorPicker = null;
        if (!this.state.showColorPicker) {
            colorPicker = <div />;
        } else {
            colorPicker = <div id="color-picker"><div className="arrow-right" />
                <button id="basic-button-1" onClick={() => { this.handlePickerTypeChange('Gradient'); }}>Gradient</button>
                <button id="basic-button-1" onClick={() => { this.handlePickerTypeChange('Grid'); }}>Grid</button>
                {this.handlePickerRender()}

            </div>;
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
            <div>
                <div id="inline-close" className="color-editor" onClick={this.toggleColorEditor}>
                    <h1>Color Editor</h1>
                    <div className={this.state.showColorEditor ? 'arrow-right-small' : 'arrow-down'} />
                </div>
                <div className="color-editor" style={this.state.showColorEditor ? {display: "none"} : {display: 'flex'}}>
                    <div id="inline-apart">
                        <div id="inline-close">
                            <div style={currentColorStyle} id="current-color-display" onClick={this.showColorInfo} />
                            {colorPicker}
                            <button id="basic-button-1" onClick={this.handleAddColor}>+</button>
                            <Select value={colorType} onChange={this.handleChangeColorType}>
                                {colorOptions.map(({ value, label }) => {
                                    return <option value={value}>{label}</option>;
                                })}
                            </Select>
                        </div>
                    </div>
                    <form id="opacity-form" onSubmit={this.handleSubmit}>
                        <label>Opacity:</label>
                        <input className="range-input" type="range" min="1" max="100" value={this.tempValue} defaultValue="100" step="1" onChange={this.handleChange} />
                        <input type="text" className="input" value={this.tempOpacityValue * 100.0} onChange={this.handleChange} />
                    </form>
                    <div id="inline-close">

                        { colorInput }
                    </div>
                    <div className="horz-div" />
                </div>
            </div>
        );
    }
}

export default ColorMenu;
