import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextMenu, PathMenu, RectangleMenu, EllipseMenu } from './menu-layouts';
import './contextual-menu.css';

class ContextualMenu extends Component {
    static propTypes = {
        selectedShape: PropTypes.object,
        scale: PropTypes.number,
        unitType: PropTypes.string,
        unitDivisions: PropTypes.number,
        canvasWidthInUnits: PropTypes.number,
        canvasHeightInUnits: PropTypes.number,
        editShape: PropTypes.func,
        editText: PropTypes.func,
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
        onSetCustomZoom: PropTypes.func,
        onShowGrid: PropTypes.func,
        onShowRulers: PropTypes.func,
        onShowSubDivisions: PropTypes.func,
        onSetRulerGrid: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            hidden: false
        };

        this.toggleMenu = this.toggleMenu.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleEditText = this.handleEditText.bind(this);
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
        this.handleZoomIn = this.handleZoomIn.bind(this);
        this.handleZoomOut = this.handleZoomOut.bind(this);
        this.handleShowGrid = this.handleShowGrid.bind(this);
        this.handleShowRulers = this.handleShowRulers.bind(this);
        this.handleShowSubDivisions = this.handleShowSubDivisions.bind(this);
        this.handleSubmitCustomZoom = this.handleSubmitCustomZoom.bind(this);
        this.handleSubmitRulerGrid = this.handleSubmitRulerGrid.bind(this);
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

    handleEditText(shape) {
        const { editText } = this.props;
        editText && editText(shape);
    }

    handleChange(event) {
        this.tempScale = event.target.value / 100.0;
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
        this.props.onSetCustomZoom(this.props.scale * 2);
    }

    handleZoomOut() {
        this.props.onSetCustomZoom(this.props.scale / 2);
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

    handleSubmitCustomZoom(event) {
        this.props.onSetCustomZoom(parseFloat(document.getElementById("scale").value) / 100.0);
        event.preventDefault();
    }

    handleSubmitRulerGrid(event) {
        this.props.onSetRulerGrid({
            unitType: document.getElementById("unitType").value,
            width: document.getElementById("width").value,
            height: document.getElementById("height").value,
            unitDivisions: document.getElementById("unitDivisions").value
        });
        event.preventDefault();
    }

    render() {
        const { selectedShape, scale, unitType, unitDivisions, canvasWidthInUnits, canvasHeightInUnits } = this.props;
        const { hidden } = this.state;
        let menuLayout = null;
        if (selectedShape) {
            if (selectedShape.type === 'text') {
                menuLayout = <TextMenu text={selectedShape} onEdit={this.handleEdit} onEditText={this.handleEditText} />;
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
                    </div>
                    <div className="ruler-menu">
                        <form id="button-icon" onSubmit={this.handleSubmitRulerGrid}>
                            <select
                                id="unitType"
                                defaultValue={unitType}
                            >
                                <option value="in">{"in"}</option>
                                <option value="ft">ft</option>
                                <option value="mm">mm</option>
                                <option value="cm">cm</option>
                                <option value="m">m</option>
                                <option value="px">px</option>
                                <option value="pt">pt</option>
                            </select>
                            <input
                                id="width"
                                defaultValue={canvasWidthInUnits}
                                type="number"
                                step="0.01"
                            />
                            <input
                                id="height"
                                defaultValue={canvasHeightInUnits}
                                type="number"
                                step="0.01"
                            />
                            <input
                                id="unitDivisions"
                                defaultValue={unitDivisions}
                                type="number"
                            />
                            <input type="submit" value="resize" />
                        </form>
                    </div>
                    <div className="zoom-menu">
                        <button onClick={this.handleZoomIn} id="button-icon">+</button>
                        <button onClick={this.handleZoomOut} id="button-icon">-</button>
                        <form id="button-icon" onSubmit={this.handleSubmitCustomZoom}>
                            {Math.round(scale * 100.0) + "% "}
                            <input
                                id="scale"
                                defaultValue={Math.round(scale * 100.0)}
                                type="number"
                            />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default ContextualMenu;
