import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './color-menu.css';
import OpacityEditor from './OpacityEditor';

class ColorMenu extends Component {
    static propTypes = {
        fillColor: PropTypes.object,
        currentColor: PropTypes.object,
        onUpdateOpacity: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.tempOpacityValue = this.props.currentColor.a;

        this.handleUpdate = this.handleUpdate.bind(this);
        this.showColorInfo = this.showColorInfo.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    render() {
        const { fillColor, currentColor } = this.props;
        const currentColorStyle = {
            backgroundColor: `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${currentColor.a} )`
        };
        return (
            <div className="color-editor">
                <h1>Color Editor</h1>
                <form onSubmit={this.handleSubmit}>
                    <input type="range" min="1" max="100" value={this.tempValue} defaultValue="100" step="1" onChange={this.handleChange} />
                    <input type="text" value={this.tempOpacityValue * 100.0} onChange={this.handleChange} />
                </form>
                <div style={currentColorStyle} id="current-color-display" onClick={this.showColorInfo} />
                <div id="color-input">
                    <p>R: <input type="text" value={fillColor.r} onChange={this.handleUpdateR} /> </p>
                    <p>G: <input type="text" value={fillColor.g} /> </p>
                    <p>B: <input type="text" value={fillColor.b} /> </p>
                </div>
            </div>
        );
    }
}

export default ColorMenu;
