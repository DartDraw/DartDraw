import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from '../../ui';
import './menu-layouts.css';

class TextMenu extends Component {
    static propTypes = {
        text: PropTypes.object,
        onEdit: PropTypes.func,
        onEditText: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleFontFamilyChange = this.handleFontFamilyChange.bind(this);
        this.handleFontSizeChange = this.handleFontSizeChange.bind(this);
        this.handleFontStyleChange = this.handleFontStyleChange.bind(this);
        this.handleFontWeightChange = this.handleFontWeightChange.bind(this);
        this.handleTextAlignChange = this.handleTextAlignChange.bind(this);
        this.handleTextDecorationChange = this.handleTextDecorationChange.bind(this);
        this.handleWidthChange = this.handleWidthChange.bind(this);
        this.handleHeightChange = this.handleHeightChange.bind(this);
        this.handleXChange = this.handleXChange.bind(this);
        this.handleYChange = this.handleYChange.bind(this);
    }

    handleFontFamilyChange(value) {
        const { text, onEditText } = this.props;
        onEditText && onEditText({ id: text.id, fontFamily: value });
    }

    handleFontSizeChange(value) {
        const { text, onEditText } = this.props;
        onEditText && onEditText({ id: text.id, fontSize: value });
    }

    handleFontStyleChange(value) {
        const { text, onEditText } = this.props;
        onEditText && onEditText({ id: text.id, fontStyle: value });
    }

    handleTextAlignChange(value) {
        const { text, onEdit } = this.props;
        onEdit && onEdit({ ...text, textAlign: value });
    }

    handleTextDecorationChange(value) {
        const { text, onEditText } = this.props;
        onEditText && onEditText({ id: text.id, textDecoration: value });
    }

    handleFontWeightChange(value) {
        const { text, onEditText } = this.props;
        onEditText && onEditText({ id: text.id, fontWeight: value });
    }

    handleWidthChange(value) {
        const { text, onEdit } = this.props;
        onEdit && onEdit({ ...text, width: value });
    }

    handleHeightChange(value) {
        const { text, onEdit } = this.props;
        onEdit && onEdit({ ...text, height: value });
    }

    handleXChange(value) {
        const { text, onEdit } = this.props;
        onEdit && onEdit({ ...text, x: value });
    }

    handleYChange(value) {
        const { text, onEdit } = this.props;
        onEdit && onEdit({ ...text, y: value });
    }

    render() {
        return (
            <div className="text-menu menu">
                <div className="menu-title">TEXT SETTINGS</div>
                <div className="menu-row">
                    <Select value={this.props.text.fontFamily} label="Typeface" onChange={this.handleFontFamilyChange}>
                        <option value="helvetica">Helvetica</option>
                        <option value="arial">Arial</option>
                        <option value="times new roman">Times New Roman</option>
                        <option value="times">Times</option>
                        <option value="courier">Courier</option>
                        <option value="courier new">Courier New</option>
                        <option value="verdana">Verdana</option>
                        <option value="georgia">Georgia</option>
                        <option value="garamond">Garamond</option>
                        <option value="comic sans ms">Comic Sans</option>
                    </Select>
                </div>
                <div className="menu-row">
                    <Select value={this.props.text.fontSize} label="Font Size" onChange={this.handleFontSizeChange} style={{ width: 46, marginRight: 12 }}>
                        <option value={5}>5</option>
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={72}>72</option>
                        <option value={100}>100</option>
                    </Select>
                    <Select value={this.props.text.fontWeight} label="Weight" onChange={this.handleFontWeightChange} style={{ width: 73 }}>
                        <option value="lighter">lighter</option>
                        <option value="normal">normal</option>
                        <option value="bold">bold</option>
                    </Select>
                </div>
                <div className="menu-row">
                    <Select value={this.props.text.textAlign} label="Text Align" onChange={this.handleTextAlignChange}>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                        <option value="center">Center</option>
                    </Select>
                </div>
                <div className="menu-row">
                    <Select value={this.props.text.fontStyle} label="Font Style" onChange={this.handleFontStyleChange} style={{ marginRight: 12 }}>
                        <option value="normal">normal</option>
                        <option value="italic">italic</option>
                        <option value="oblique">oblique</option>
                    </Select>
                    <Select value={this.props.text.textDecoration} label="Text Decoration" onChange={this.handleTextDecorationChange}>
                        <option value="none">None</option>
                        <option value="underline">Underline</option>
                        <option value="line-through">Strikethrough</option>
                    </Select>
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Position:</div>
                    <Input value={this.props.text.x} label="X" style={{ width: 49, marginRight: 11 }} onChange={this.handleXChange} />
                    <Input value={this.props.text.y} label="Y" style={{ width: 49 }} onChange={this.handleYChange} />
                </div>
                <div className="menu-row">
                    <div className="menu-row-title">Size:</div>
                    <Input value={this.props.text.width} label="Width" style={{ width: 49, marginRight: 11 }} onChange={this.handleWidthChange} />
                    <Input value={this.props.text.height} label="Height" style={{ width: 49 }} onChange={this.handleHeightChange} />
                </div>
            </div>
        );
    }
}

export default TextMenu;
