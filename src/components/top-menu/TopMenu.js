import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './top-menu.css';
import { CirclePicker } from 'react-color';

class TopMenu extends Component {
    static propTypes = {
        onUndoClick: PropTypes.func,
        onRedoClick: PropTypes.func,
        fillColor: PropTypes.object,
        strokeColor: PropTypes.object,
        onButtonSelect: PropTypes.func,
        onAllignmentClick: PropTypes.func,
        onGroupClick: PropTypes.func,
        onUngroupClick: PropTypes.func,
        onMoveBackward: PropTypes.func,
        onMoveForward: PropTypes.func,
        onSendToBack: PropTypes.func,
        onBringToFront: PropTypes.func,
        onFlipHorizontal: PropTypes.func,
        onFlipVertical: PropTypes.func,
        onToggleGridSnapping: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleUndoClick = this.handleUndoClick.bind(this);
        this.handleRedoClick = this.handleRedoClick.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.handleButtonSelect = this.handleButtonSelect.bind(this);
        this.handleAlignmentClick = this.handleAlignmentClick.bind(this);

        this.handleGroupClick = this.handleGroupClick.bind(this);
        this.handleUngroupClick = this.handleUngroupClick.bind(this);
        this.handleMoveBackward = this.handleMoveBackward.bind(this);
        this.handleMoveForward = this.handleMoveForward.bind(this);
        this.handleSendToBack = this.handleSendToBack.bind(this);
        this.handleBringToFront = this.handleBringToFront.bind(this);
        this.handleFlipHorizontal = this.handleFlipHorizontal.bind(this);
        this.handleFlipVertical = this.handleFlipVertical.bind(this);
        this.handleToggleGridSnapping = this.handleToggleGridSnapping.bind(this);
    }

    handleUndoClick() {
        this.props.onUndoClick();
    }

    handleRedoClick() {
        this.props.onRedoClick();
    }

    handleToggleGridSnapping(event) {
        this.props.onToggleGridSnapping();
    }

    handleGroupClick() {
        this.props.onGroupClick();
    }

    handleUngroupClick() {
        this.props.onUngroupClick();
    }

    handleMoveForward() {
        this.props.onMoveForward();
    }

    handleMoveBackward() {
        this.props.onMoveBackward();
    }

    handleBringToFront() {
        this.props.onBringToFront();
    }

    handleSendToBack() {
        this.props.onSendToBack();
    }

    handleFlipHorizontal() {
        this.props.onFlipHorizontal();
    }

    handleFlipVertical() {
        this.props.onFlipVertical();
    }

    handleColorSelect(color, event) {
        this.props.onColorSelect(color.rgb);
    }

    handlePaletteSelect(event) {
        // this.props.onPaletteSelect(paletteName);
        // where paletteName is a string (verified on backend)
    }

    handleAddColor(color, event) {
        this.props.onAddColor(color.rgb); // new color added to the end of the current palette
    }

    handleRemoveColor(color, event) {
        this.props.onRemoveColor(color.rgb); // removed from current palette
    }

    handleZoomIn() {
        this.props.onZoomIn();
    }

    handleZoomOut() {
        this.props.onZoomOut();
    }
    handleChange(event) {
        this.tempScale = event.target.value / 100.0;
    }

    handleAlignmentClick(event) {
        let id = event.target.id;
        if (!id) {
            id = event.target.firstChild.id;
        }
        this.props.onAllignmentClick(id);
    }

    handleButtonSelect(color, button) {
        // console.log(color);
        // console.log(button);
        this.props.onButtonSelect({color, button});
    }

    render() {
        const { fillColor, strokeColor, currentPalette } = this.props;
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
                    <label htmlFor="fill" style={fillStyle} onClick={() => { this.handleButtonSelect(fillColor, "fill"); }} />
                    <p>Fill</p>
                    <span />
                    <input type="radio" name="toggle" value="stroke" id="stroke" />
                    <label htmlFor="stroke" style={strokeStyle} onClick={() => { this.handleButtonSelect(strokeColor, "stroke"); }} />
                    <p>Stroke</p>
                </form>
                <button onClick={this.handleGroupClick}>
                    <img src="./assets/group.svg" alt="group" id="button-icon" />
                </button>
                <button onClick={this.handleUngroupClick}>
                    <img src="./assets/ungroup.svg" alt="ungroup" id="button-icon" />
                </button>
                <button onClick={this.handleMoveForward}>
                    <img src="./assets/upone.svg" alt="upone" id="button-icon" />
                </button>
                <button onClick={this.handleMoveBackward}>
                    <img src="./assets/backone.svg" alt="downone" id="button-icon" />
                </button>
                <button onClick={this.handleSendToBack}>
                    <img src="./assets/SendToBack.svg" alt="backall" id="button-icon" />
                </button>
                <button onClick={this.handleBringToFront}>
                    <img src="./assets/BringToFront.svg" alt="frontall" id="button-icon" />
                </button>
                <button onClick={this.handleFlipHorizontal}>
                    <img src="./assets/flip-horz.svg" alt="frontall" id="button-icon" />
                </button>
                <button onClick={this.handleFlipVertical}>
                    <img src="./assets/flip-vert.svg" alt="frontall" id="button-icon" />
                </button>
                <button onClick={this.handleToggleGridSnapping} id="button-icon">G</button>
                <button onClick={this.handleAlignmentClick}>
                    <img src="./assets/center-alignment.svg" alt="center-alignment" id="alignment-vertical" />
                </button>
                <button onClick={this.handleAlignmentClick}>
                    <img src="./assets/vertical-alignment.svg" alt="center-alignment" id="alignment-horizontal" />
                </button>
                <button onClick={this.handleAlignmentClick}>
                    <img src="./assets/left-alignment.svg" alt="left-alignment" id="alignment-left" />
                </button>
                <button onClick={this.handleAlignmentClick}>
                    <img src="./assets/right-alignment.svg" alt="right-alignment" id="alignment-right" />
                </button>
                <button onClick={this.handleAlignmentClick}>
                    <img src="./assets/vertical-alignment-1.svg" alt="vertical-alignment-1" id="alignment-bottom" />
                </button>
                <button onClick={this.handleAlignmentClick}>
                    <img src="./assets/vertical-alignment-2.svg" alt="vertical-alignment-2" id="alignment-top" />
                </button>
            </div>
        );
    }
}

export default TopMenu;
