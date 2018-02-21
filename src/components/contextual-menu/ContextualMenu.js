import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextMenu, PathMenu, RectangleMenu, EllipseMenu } from './menu-layouts';
import { ColorMenuContainer } from '../color-editor';
import { PaletteEditorContainer } from '../palette-editor';
import { CONTEXTUAL_MENU_WIDTH } from '../../constants';
import './contextual-menu.css';

class ContextualMenu extends Component {
    static propTypes = {
        selectedShape: PropTypes.object,
        scale: PropTypes.number,
        unitType: PropTypes.string,
        unitDivisions: PropTypes.number,
        canvasWidthInUnits: PropTypes.number,
        canvasHeightInUnits: PropTypes.number,
        rulerNames: PropTypes.array,
        currentRuler: PropTypes.string,
        currentKeys: PropTypes.object,
        hidden: PropTypes.bool,
        onToggleHidden: PropTypes.func,
        editShape: PropTypes.func,
        fillColor: PropTypes.object,
        onAlignmentClick: PropTypes.func,
        onDistributeClick: PropTypes.func,
        editText: PropTypes.func,
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
        onSetRulerGrid: PropTypes.func,
        onSelectRuler: PropTypes.func,
        onAddRuler: PropTypes.func,
        onSaveRuler: PropTypes.func,
        onDeleteRuler: PropTypes.func,
        onToggleRuler: PropTypes.func,
        onResizeShapeTo: PropTypes.func,
        onMoveShapeTo: PropTypes.func,
        onRotateShapeTo: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            toggleScale: 1
        };

        this.handleEdit = this.handleEdit.bind(this);
        this.handleToggleHidden = this.handleToggleHidden.bind(this);
        this.handleEditText = this.handleEditText.bind(this);
        this.handleAlignmentClick = this.handleAlignmentClick.bind(this);
        this.handleDistributeClick = this.handleDistributeClick.bind(this);
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
        this.handleToggleScale = this.handleToggleScale.bind(this);
        this.handleShowGrid = this.handleShowGrid.bind(this);
        this.handleShowRulers = this.handleShowRulers.bind(this);
        this.handleShowSubDivisions = this.handleShowSubDivisions.bind(this);
        this.handleSubmitCustomZoom = this.handleSubmitCustomZoom.bind(this);
        this.handleSubmitRulerGrid = this.handleSubmitRulerGrid.bind(this);
        this.handleSelectRuler = this.handleSelectRuler.bind(this);
        this.handleAddRuler = this.handleAddRuler.bind(this);
        this.handleSaveRuler = this.handleSaveRuler.bind(this);
        this.handleDeleteRuler = this.handleDeleteRuler.bind(this);
        this.handleToggleRuler = this.handleToggleRuler.bind(this);
        this.handleToggleCanvasOrientation = this.handleToggleCanvasOrientation.bind(this);
        this.handleResizeShapeTo = this.handleResizeShapeTo.bind(this);
        this.handleMoveShapeTo = this.handleMoveShapeTo.bind(this);
        this.handleRotateShapeTo = this.handleRotateShapeTo.bind(this);
    }

    handleToggleHidden() {
        const { onToggleHidden } = this.props;
        onToggleHidden && onToggleHidden();
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
        this.props.onAlignmentClick(id);
    }

    handleDistributeClick(event) {
        let id = event.target.id;
        if (!id) {
            id = event.target.firstChild.id;
        }
        this.props.onDistributeClick(id);
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

    handleToggleScale() {
        var { toggleScale } = this.state;
        var currentScale = this.props.scale;

        if (currentScale === 1) {
            this.props.onSetCustomZoom(toggleScale);
        } else {
            this.props.onSetCustomZoom(1);
            this.setState({
                toggleScale: currentScale
            });
        }
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
        var scale = parseFloat(event.target.value) / 100.0;
        if (scale >= 0.1 && scale <= 32) {
            this.props.onSetCustomZoom(scale);
        }
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

    handleResizeShapeTo(width, height) {
        this.props.onResizeShapeTo(width, height);
    }

    handleMoveShapeTo(x, y) {
        console.log("handleMoveShapeTo called");
        this.props.onMoveShapeTo(x, y);
    }

    handleRotateShapeTo(degree) {
        this.props.onRotateShapeTo(degree);
    }

    handleToggleCanvasOrientation(event) {
        const { unitType, canvasWidthInUnits, canvasHeightInUnits, unitDivisions } = this.props;
        this.props.onSetRulerGrid({
            unitType,
            width: canvasHeightInUnits,
            height: canvasWidthInUnits,
            unitDivisions
        });
        event.preventDefault();
    }

    handleSelectRuler(event) {
        this.props.onSelectRuler(event.target.value);
        event.preventDefault();
    }

    handleAddRuler(event) {
        const { rulerNames } = this.props;
        var name = document.getElementById("rulerName").value;

        if (name === "") {
            console.error("Please name your new ruler.");
        } else if (rulerNames.indexOf(name) === -1) {
            this.props.onAddRuler({
                name,
                unitType: document.getElementById("unitType").value,
                unitDivisions: parseInt(document.getElementById("unitDivisions").value, 10)
            });
        } else {
            console.error("The name '%s' is already taken. Please enter a different name for your ruler preset.", name);
        }
        event.preventDefault();
    }

    handleSaveRuler(event) {
        const { currentRuler } = this.props;

        if (currentRuler !== "Default") {
            this.props.onSaveRuler({
                unitType: document.getElementById("unitType").value,
                unitDivisions: parseInt(document.getElementById("unitDivisions").value, 10)
            });
        } else {
            console.error("You cannot edit the default ruler.");
        }
        event.preventDefault();
    }

    handleDeleteRuler(event) {
        const { currentRuler } = this.props;

        if (currentRuler !== "Default") {
            this.props.onDeleteRuler();
        } else {
            console.error("You cannot delete the default ruler.");
        }
        event.preventDefault();
    }

    handleToggleRuler(event) {
        const { currentKeys } = this.props;
        var forward = true;

        if (currentKeys[18]) {
            forward = false;
        }

        this.props.onToggleRuler(forward);
        event.preventDefault();
    }

    createRulerPresetList() {
        const { rulerNames } = this.props;
        let list = [];

        rulerNames.map((presetName) => {
            list.push(<option key={presetName} value={presetName}>{presetName}</option>);
        });

        return list;
    }

    render() {
        const { hidden, selectedShape, scale, unitType, unitDivisions, currentRuler, canvasWidthInUnits, canvasHeightInUnits } = this.props;

        let menuLayout = null;
        let colorLayout = null;
        if (selectedShape) {
            if (selectedShape.type === 'text') {
                menuLayout = <TextMenu text={selectedShape} onEdit={this.handleEdit} onEditText={this.handleEditText} />;
            } else if (selectedShape.type === 'rectangle') {
                menuLayout = <RectangleMenu rectangle={selectedShape} onEdit={this.handleEdit} onResizeShapeTo={this.handleResizeShapeTo} onMoveShapeTo={this.handleMoveShapeTo} onRotateShapeTo={this.handleRotateShapeTo} />;
            } else if (selectedShape.type === 'line') {
                menuLayout = <PathMenu path={selectedShape} onEdit={this.handleEdit} />;
            } else if (selectedShape.type === 'ellipse') {
                menuLayout = <EllipseMenu ellipse={selectedShape} onEdit={this.handleEdit} onRotateShapeTo={this.handleRotateShapeTo} onMoveShapeTo={this.handleMoveShapeTo} />;
            }
        }

        return (
            <div className="contextual-menu" style={{ width: CONTEXTUAL_MENU_WIDTH, right: hidden ? -352 : 0 }}>
                <div className="hide-button-column">
                    <div className="hide-button" onClick={this.handleToggleHidden} />
                </div>
                <div className="menu-column">
                    <ColorMenuContainer />
                    <PaletteEditorContainer />
                    <div className="dynamic-menu">
                        { menuLayout }
                    </div>
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
                    <h2>Distribution</h2>
                    <div className="static-menu">
                        <button onClick={this.handleDistributeClick}>
                            <img src="" alt="top" id="distribute-top" />
                        </button>
                        <button onClick={this.handleDistributeClick}>
                            <img src="" alt="center" id="distribute-vertical" />
                        </button>
                        <button onClick={this.handleDistributeClick}>
                            <img src="" alt="bottom" id="distribute-bottom" />
                        </button>
                        <button onClick={this.handleDistributeClick}>
                            <img src="" alt="height" id="distribute-height" />
                        </button>
                        <button onClick={this.handleDistributeClick}>
                            <img src="" alt="left" id="distribute-left" />
                        </button>
                        <button onClick={this.handleDistributeClick}>
                            <img src="" alt="center" id="distribute-horizontal" />
                        </button>
                        <button onClick={this.handleDistributeClick}>
                            <img src="" alt="right" id="distribute-right" />
                        </button>
                        <button onClick={this.handleDistributeClick}>
                            <img src="" alt="width" id="distribute-width" />
                        </button>
                    </div>
                    <h2>Ruler / Grid / Canvas Settings</h2>
                    <div className="temp">
                        <button onClick={this.handleShowRulers} id="button-icon">R</button>
                        <button onClick={this.handleShowGrid} id="button-icon">G</button>
                        <button onClick={this.handleShowSubDivisions} id="button-icon">S</button>
                        <button onClick={this.handleToggleRuler} id="button-icon">P</button>
                        <button onClick={this.handleToggleCanvasOrientation} id="button-icon">O</button>
                    </div>
                    <div className="ruler-menu">
                        <select id="selectRuler" value={currentRuler} onChange={this.handleSelectRuler}>
                            {this.createRulerPresetList()}
                        </select>
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
                        <form id="button-icon" onSubmit={this.handleAddRuler}>
                            <input type="submit" value="add" />
                            <input
                                id="rulerName"
                                placeholder="name your ruler"
                                type="text"
                            />
                        </form>
                        <form id="button-icon" onSubmit={this.handleSaveRuler}>
                            <input type="submit" value="save" />
                        </form>
                        <form id="button-icon" onSubmit={this.handleDeleteRuler}>
                            <input type="submit" value="delete" />
                        </form>
                    </div>
                    <div className="dynamic-menu">
                        { menuLayout }
                    </div>
                    <h2>Zoom Settings</h2>
                    <div className="zoom-menu">
                        <button onClick={this.handleZoomIn} id="button-icon">+</button>
                        <button onClick={this.handleZoomOut} id="button-icon">-</button>
                        <button onClick={this.handleToggleScale} id="button-icon">z</button>
                        <form id="button-icon" onSubmit={(event) => event.preventDefault()}>
                            <input
                                id="zoomSlider"
                                type="range"
                                defaultValue={Math.round(scale * 100.0)}
                                min="10"
                                max="3200"
                                onInput={this.handleSubmitCustomZoom}
                            />
                            <input
                                id="zoomText"
                                type="number"
                                defaultValue={Math.round(scale * 100.0)}
                                onInput={this.handleSubmitCustomZoom}
                            />
                            {Math.round(scale * 100.0) + "% "}
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default ContextualMenu;
