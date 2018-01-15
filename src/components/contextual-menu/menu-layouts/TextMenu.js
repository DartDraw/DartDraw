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
        this.handleTextAlignChange = this.handleTextAlignChange.bind(this);
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

    handleTextAlignChange(event){
        const { text, onEdit } = this.props;
        const newText = Object.assign({}, text, { textAlign: event.target.value});
        onEdit && onEdit(newText);
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
                <select value={this.props.text.textAlign} onChange={this.handleTextAlignChange}>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="center">Center</option>
                </select>
            </div>
        );
    }
}

export default TextMenu;
