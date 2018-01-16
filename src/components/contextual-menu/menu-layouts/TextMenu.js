import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './menu-layouts.css';

class TextMenu extends Component {
    static propTypes = {
        text: PropTypes.object,
        onEdit: PropTypes.func
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
        this.handleXChange = this.handleYChange.bind(this);

    }

    handleFontFamilyChange(event) {
        const { text, onEdit } = this.props;
        const newText = Object.assign({}, text, { fontFamily: event.target.value });
        onEdit && onEdit(newText);
    }

    handleFontSizeChange(event) {
        const { text, onEdit } = this.props;
        const newText = Object.assign({}, text, { fontSize: event.target.value });
        onEdit && onEdit(newText);
    }

    handleFontStyleChange(event){
        const { text, onEdit } = this.props;
        const newText = Object.assign({}, text, { fontStyle: event.target.value });
        onEdit && onEdit(newText);
    }

    handleTextAlignChange(event){
        const { text, onEdit } = this.props;
        const newText = Object.assign({}, text, { textAlign: event.target.value});
        onEdit && onEdit(newText);
    }

    handleTextDecorationChange(event){
        const { text, onEdit } = this.props;
        const newText = Object.assign({}, text, { textDecoration: event.target.value});
        onEdit && onEdit(newText);
    }

    handleFontWeightChange(event){
        const { text, onEdit } = this.props;
        const newText = Object.assign({}, text, { fontWeight: event.target.value });
        onEdit && onEdit(newText);
    }

    handleWidthChange(event) {
        const { rectangle, onEdit } = this.props;
        const newRectangle = Object.assign({}, rectangle, { width: event.target.value });
        onEdit && onEdit(newRectangle);
    }

    handleHeightChange(event) {
        const { rectangle, onEdit } = this.props;
        const newRectangle = Object.assign({}, rectangle, { height: event.target.value });
        onEdit && onEdit(newRectangle);
    }

    handleXChange(event) {
        const { rectangle, onEdit } = this.props;
        const newRectangle = Object.assign({}, rectangle, { x: event.target.value });
        onEdit && onEdit(newRectangle);
    }

    handleYChange(event) {
        const { rectangle, onEdit } = this.props;
        const newRectangle = Object.assign({}, rectangle, { y: event.target.value });
        onEdit && onEdit(newRectangle);
    }

    render() {
        return (
            <div className="text-menu">
                <select value={this.props.text.fontFamily} onChange={this.handleFontFamilyChange}>
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
                </select>
                <select value={this.props.text.fontSize} onChange={this.handleFontSizeChange}>
                    <option value="5px">5</option>
                    <option value="12px">12</option>
                    <option value="24px">24</option>
                    <option value="72px">72</option>
                    <option value="100px">100</option>
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
