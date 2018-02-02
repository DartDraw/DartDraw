import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from '../../shared';
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

    handleFontSizeChange(event) {
        const { text, onEditText } = this.props;
        onEditText && onEditText({ id: text.id, fontSize: event.target.value });
    }

    handleFontStyleChange(event) {
        const { text, onEditText } = this.props;
        onEditText && onEditText({ id: text.id, fontStyle: event.target.value });
    }

    handleTextAlignChange(event) {
        const { text, onEdit } = this.props;
        onEdit && onEdit({ ...text, textAlign: event.target.value });
    }

    handleTextDecorationChange(event) {
        const { text, onEditText } = this.props;
        onEditText && onEditText({ id: text.id, textDecoration: event.target.value });
    }

    handleFontWeightChange(event) {
        const { text, onEditText } = this.props;
        onEditText && onEditText({ id: text.id, fontWeight: event.target.value });
    }

    handleWidthChange(event) {
        const { text, onEdit } = this.props;
        onEdit && onEdit({ ...text, width: event.target.value });
    }

    handleHeightChange(event) {
        const { text, onEdit } = this.props;
        onEdit && onEdit({ ...text, height: event.target.value });
    }

    handleXChange(event) {
        const { text, onEdit } = this.props;
        onEdit && onEdit({ ...text, x: event.target.value });
    }

    handleYChange(event) {
        const { text, onEdit } = this.props;
        onEdit && onEdit({ ...text, y: event.target.value });
    }

    render() {
        return (
            <div className="text-menu">
                <Select value={this.props.text.fontFamily} onChange={this.handleFontFamilyChange}>
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
                <select value={this.props.text.fontSize} onChange={this.handleFontSizeChange}>
                    <option value={5}>5</option>
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={72}>72</option>
                    <option value={100}>100</option>
                </select>
                <select value={this.props.text.fontStyle} onChange={this.handleFontStyleChange}>
                    <option value="normal">normal</option>
                    <option value="italic">italic</option>
                    <option value="oblique">oblique</option>
                </select>
                <select value={this.props.text.fontWeight} onChange={this.handleFontWeightChange}>
                    <option value="lighter">lighter</option>
                    <option value="normal">normal</option>
                    <option value="bold">bold</option>
                </select>
                <select value={this.props.text.textAlign} onChange={this.handleTextAlignChange}>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="center">Center</option>
                </select>
                <select value={this.props.text.textDecoration} onChange={this.handleTextDecorationChange}>
                    <option value="none">None</option>
                    <option value="underline">Underline</option>
                    <option value="line-through">Strikethrough</option>
                </select>
                <input value={this.props.text.x} />
                <input value={this.props.text.y} />
                <input value={this.props.text.width} />
                <input value={this.props.text.height} />
            </div>
        );
    }
}

export default TextMenu;
