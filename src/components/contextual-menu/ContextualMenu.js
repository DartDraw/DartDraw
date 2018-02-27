import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, SelectRow } from '../ui';
import {
    TextMenu,
    PathMenu,
    RectangleMenu,
    EllipseMenu,
    LineMenu,
    PolygonMenu,
    PolylineMenu,
    BezierMenu,
    ArcMenu,
    FreehandPathMenu
} from './menu-layouts';
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
        onSelectZoomTool: PropTypes.func,
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
        this.handleSelectScale = this.handleSelectScale.bind(this);
        this.handleSelectZoomTool = this.handleSelectZoomTool.bind(this);
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

    handleSelectZoomTool() {
        this.props.onSelectZoomTool();
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

    handleSubmitCustomZoom(value) {
        var scale = parseFloat(value) / 100.0;
        if (scale >= 0.1 && scale <= 32) {
            this.props.onSetCustomZoom(scale);
        }
    }

    handleSelectScale(value) {
        this.props.onSetCustomZoom(value);
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
        if (selectedShape) {
            if (selectedShape.type === 'text') {
                menuLayout = <TextMenu text={selectedShape} onEdit={this.handleEdit} onEditText={this.handleEditText} />;
            } else if (selectedShape.type === 'rectangle') {
                menuLayout = <RectangleMenu rectangle={selectedShape} onEdit={this.handleEdit} onResizeShapeTo={this.handleResizeShapeTo} onMoveShapeTo={this.handleMoveShapeTo} onRotateShapeTo={this.handleRotateShapeTo} />;
            } else if (selectedShape.type === 'line') {
                menuLayout = <LineMenu line={selectedShape} onEdit={this.handleEdit} />;
            } else if (selectedShape.type === 'ellipse') {
                menuLayout = <EllipseMenu ellipse={selectedShape} onEdit={this.handleEdit} onRotateShapeTo={this.handleRotateShapeTo} onMoveShapeTo={this.handleMoveShapeTo} />;
            } else if (selectedShape.type === 'polygon') {
                menuLayout = <PolygonMenu polygon={selectedShape} onEdit={this.handleEdit} />;
            } else if (selectedShape.type === 'polyline') {
                menuLayout = <PolylineMenu polyline={selectedShape} onEdit={this.handleEdit} />;
            } else if (selectedShape.type === 'bezier') {
                menuLayout = <BezierMenu bezier={selectedShape} onEdit={this.handleEdit} />;
            } else if (selectedShape.type === 'arc') {
                menuLayout = <ArcMenu arc={selectedShape} onEdit={this.handleEdit} />;
            } else if (selectedShape.type === 'path') {
                menuLayout = <PathMenu path={selectedShape} onEdit={this.handleEdit} />;
            } else if (selectedShape.type === 'freehandPath') {
                menuLayout = <FreehandPathMenu path={selectedShape} onEdit={this.handleEdit} />;
            }
        }

        return (
            <div className="contextual-menu" style={{ width: CONTEXTUAL_MENU_WIDTH, right: hidden ? -CONTEXTUAL_MENU_WIDTH : 0 }}>
                <div className="hide-button" onClick={this.handleToggleHidden} />
                <div className="menu-column">
                    <div className="menu-column-top">
                        <div className="color-menu">
                            <ColorMenuContainer />
                            <PaletteEditorContainer />
                        </div>
                        <div className="dynamic-menu">
                            { menuLayout }
                        </div>
                    </div>
                    <div className="zoom-menu">
                        <div className="zoom-select-row">
                            <SelectRow value={scale} onChange={this.handleSelectScale}>
                                <div value={0.1} className="zoom-button">10%</div>
                                <div value={0.5} className="zoom-button">50%</div>
                                <div value={1} className="zoom-button">100%</div>
                                <div value={1.5} className="zoom-button">150%</div>
                                <div value={2.0} className="zoom-button">200%</div>
                            </SelectRow>
                        </div>
                        <div className="zoom-row">
                            <button onClick={this.handleSelectZoomTool}>
                                <img src="./assets/marquee-zoom.svg" />
                            </button>
                            <div className="zoom-input-row">
                                <input
                                    className="zoom-slider"
                                    type="range"
                                    defaultValue={Math.round(scale * 100.0)}
                                    min="10"
                                    max="3200"
                                    onInput={this.handleSubmitCustomZoom}
                                />
                                <Input
                                    className="zoom-input"
                                    value={Math.round(scale * 100.0)}
                                    onChange={this.handleSubmitCustomZoom}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ContextualMenu;
