import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextMenu, PathMenu, RectangleMenu, EllipseMenu } from './menu-layouts';
import './contextual-menu.css';

class ContextualMenu extends Component {
    static propTypes = {
        selectedShape: PropTypes.object,
        scale: PropTypes.number,
        ruler: PropTypes.object,
        editShape: PropTypes.func,
        onAllignmentClick: PropTypes.func,
        onGroupClick: PropTypes.func,
        onUngroupClick: PropTypes.func,
        onMoveBackward: PropTypes.func,
        onMoveForward: PropTypes.func,
        onSendToBack: PropTypes.func,
        onBringToFront: PropTypes.func,
        onFlipHorizontal: PropTypes.func,
        onFlipVertical: PropTypes.func,
        onToggleGridSnapping: PropTypes.func,
        onCustomZoom: PropTypes.func,
        onZoomIn: PropTypes.func,
        onZoomOut: PropTypes.func,
        onShowGrid: PropTypes.func,
        onShowRulers: PropTypes.func,
        onShowSubDivisions: PropTypes.func,
        onSetUnitType: PropTypes.func,
        onSetRulerExponent: PropTypes.func,
        onSetRulerBase: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            hidden: false
        };

        this.tempScale = this.props.scale;
        this.tempExponent = this.props.ruler.exponent;
        this.tempBase = this.props.ruler.base;

        this.toggleMenu = this.toggleMenu.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
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
        this.handleSubmitCustomZoom = this.handleSubmitCustomZoom.bind(this);
        this.handleSubmitRulerBase = this.handleSubmitRulerBase.bind(this);
        this.handleSubmitRulerExponent = this.handleSubmitRulerExponent.bind(this);
        this.handleZoomIn = this.handleZoomIn.bind(this);
        this.handleZoomOut = this.handleZoomOut.bind(this);
        this.handleChangeCustomZoom = this.handleChangeCustomZoom.bind(this);
        this.handleShowGrid = this.handleShowGrid.bind(this);
        this.handleShowRulers = this.handleShowRulers.bind(this);
        this.handleShowSubDivisions = this.handleShowSubDivisions.bind(this);
        this.handleSetUnitType = this.handleSetUnitType.bind(this);
        this.handleSetRulerBase = this.handleSetRulerBase.bind(this);
        this.handleSetRulerExponent = this.handleSetRulerExponent.bind(this);
    }

    toggleMenu() {
        const { hidden } = this.state;
        this.setState({
            hidden: !hidden
        });
    }

    handleEdit(shape) {
        const { editShape } = this.props;
        editShape && editShape(shape);
    }

    handleChangeCustomZoom(event) {
        this.tempScale = event.target.value / 100.0;
    }

    handleSubmitCustomZoom(event) {
        this.props.onCustomZoom(this.tempScale);
        event.preventDefault();
    }

    handleToggleGridSnapping(event) {
        this.props.onToggleGridSnapping();
    }

    handleAlignmentClick(event) {
        let id = event.target.id;
        if (!id) {
            id = event.target.firstChild.id;
        }
        this.props.onAllignmentClick(id);
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

    handleZoomIn() {
        this.props.onZoomIn();
    }

    handleZoomOut() {
        this.props.onZoomOut();
    }

    handleShowRulers() {
        this.props.onShowRulers();
    }

    handleShowGrid() {
        this.props.onShowGrid();
    }

    handleShowSubDivisions() {
        this.props.onShowSubDivisions();
    }

    handleSetUnitType(event) {
        this.props.onSetUnitType(event.target.value);
    }

    handleSetRulerBase(event) {
        console.log(event.target.value);
        console.log("^base^");
        this.tempBase = event.target.value;
    }

    handleSubmitRulerBase(event) {
        this.props.onSetRulerBase(this.tempBase);
        event.preventDefault();
    }

    handleSetRulerExponent(event) {
        console.log(event.target.value);
        console.log("^ex^");
        this.tempExponent = event.target.value;
    }

    handleSubmitRulerExponent(event) {
        this.props.onSetRulerExponent(this.tempExponent);
        event.preventDefault();
    }

    render() {
        const { selectedShape, scale, ruler } = this.props;
        const { hidden } = this.state;
        let menuLayout = null;
        if (selectedShape) {
            if (selectedShape.type === 'text') {
                menuLayout = <TextMenu text={selectedShape} onEdit={this.handleEdit} />;
            } else if (selectedShape.type === 'rectangle') {
                menuLayout = <RectangleMenu rectangle={selectedShape} onEdit={this.handleEdit} />;
            } else if (selectedShape.type === 'line') {
                menuLayout = <PathMenu path={selectedShape} onEdit={this.handleEdit} />;
            } else if (selectedShape.type === 'ellipse') {
                menuLayout = <EllipseMenu ellipse={selectedShape} onEdit={this.handleEdit} />;
            }
        }

        return (
            <div className="contextual-menu" style={{ right: hidden ? -352 : 0 }}>
                <div className="hide-button-column">
                    <div className="hide-button" onClick={this.toggleMenu} />
                </div>
                <div className="menu-column">
                    <h2>Object Manipulation</h2>
                    <div className="static-menu">
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
                    </div>
                    <h2>Alignment</h2>
                    <div className="static-menu">
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
                    <div className="dynamic-menu">
                        { menuLayout }
                    </div>
                    <div className="temp">
                        <button onClick={this.handleShowRulers} id="button-icon">R</button>
                        <button onClick={this.handleShowGrid} id="button-icon">G</button>
                        <button onClick={this.handleShowSubDivisions} id="button-icon">S</button>
                        <select value={ruler.unitType} onChange={this.handleSetUnitType}>
                            <option value="inch">inch</option>
                            <option value="cm">cm</option>
                        </select>
                        <form id="button-icon" onSubmit={this.handleSubmitRulerBase}>
                            <input type="text" onChange={this.handleSetRulerBase} />
                        </form>
                        <form id="button-icon" onSubmit={this.handleSubmitRulerExponent}>
                            <input type="text" onChange={this.handleSetRulerExponent} />
                        </form>
                    </div>
                    <div className="zoom-menu">
                        <button onClick={this.handleZoomIn} id="button-icon">+</button>
                        <button onClick={this.handleZoomOut} id="button-icon">-</button>
                        <form id="button-icon" onSubmit={this.handleSubmitCustomZoom}>
                            {Math.round(scale * 100) + "%"} <input type="text" onChange={this.handleChangeCustomZoom} />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default ContextualMenu;
