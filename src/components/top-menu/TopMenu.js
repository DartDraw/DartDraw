import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './top-menu.css';
import { CirclePicker } from 'react-color';

const currentPalette = ["#000000", "#ffffff", "#e91e63", "#9c27b0", "#673ab7", "#03a9f4", "#009688", "#4caf50", "#cddc39", "#ffc107", "#ff9800"];

class TopMenu extends Component {
    static propTypes = {
        onUndoClick: PropTypes.func,
        onRedoClick: PropTypes.func,
        onColorSelect: PropTypes.func,
        fillColor: PropTypes.object,
        strokeColor: PropTypes.object,
        onButtonSelect: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleUndoClick = this.handleUndoClick.bind(this);
        this.handleRedoClick = this.handleRedoClick.bind(this);
        this.handleChangeComplete = this.handleChangeComplete.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleButtonSelect = this.handleButtonSelect.bind(this);
    }

    handleUndoClick() {
        this.props.onUndoClick();
    }

    handleRedoClick() {
        this.props.onRedoClick();
    }

    handleChangeComplete(color, event) {
        this.props.onColorSelect(color.rgb);
    }

    handleChange(event) {
        this.tempScale = event.target.value / 100.0;
    }

    handleButtonSelect(button) {
        this.props.onButtonSelect(button);
    }

    render() {
        const { fillColor, strokeColor } = this.props;
        const fillStyle = {
            backgroundColor: `rgba(${fillColor.r}, ${fillColor.g}, ${fillColor.b}, ${fillColor.a} )` // this.props.fillColor
        };
        const strokeStyle = {
            backgroundColor: `rgba(${strokeColor.r}, ${strokeColor.g}, ${strokeColor.b}, ${strokeColor.a} )` // this.props.strokeColor
        };
        return (
            <div id="top-bar">
                <button onClick={this.handleUndoClick}>
                    <img src="./assets/undo.svg" alt="undo" id="button-icon" />
                </button>
                <button onClick={this.handleRedoClick}>
                    <img src="./assets/redo.svg" alt="redo" id="button-icon" />
                </button>

                <form id="fill-toggle" >
                    <input type="radio" name="toggle" value="fill" id="fill" defaultChecked />
                    <label htmlFor="fill" style={fillStyle} onClick={() => { this.handleButtonSelect("fill"); }} />
                    <p>Fill</p>
                    <span />
                    <input type="radio" name="toggle" value="stroke" id="stroke" />
                    <label htmlFor="stroke" style={strokeStyle} onClick={() => { this.handleButtonSelect("stroke"); }} />
                    <p>Stroke</p>
                </form>
                <div id="color-palette">
                    <CirclePicker onChangeComplete={this.handleChangeComplete} colors={currentPalette} circleSize={20} circleSpacing={5} width='450px' />
                </div>

            </div>
        );
    }
}

export default TopMenu;
