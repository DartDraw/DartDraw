import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './gui-editors.css';
import { Input, Select, SelectRow } from '../../ui';
import { ARROW_STROKE_WIDTH, ARROW_GUI_HEIGHT, ARROW_GUI_WIDTH } from '../../../constants';
import {findHeightPercentage, findLengthPercentage, findBarbLengthPercentage, findRxPercentage, findRyPercentage} from '../../../reducers/utilities/arrow';
import { Polygon, Ellipse, Rectangle, Polyline, Handle } from '../../drawing/shapes';

class ArrowGUI extends Component {
    static propTypes = {
        arrows: PropTypes.object,
        path: PropTypes.object,
        arrowMode: PropTypes.string,
        selectedArrow: PropTypes.object,
        lockAspectRatio: PropTypes.bool,
        presetNames: PropTypes.array,
        defaultPresets: PropTypes.array,
        propagateEvents: PropTypes.bool,
        onArrowHandleDrag: PropTypes.func,
        onApplyArrow: PropTypes.func,
        onToggleArrowAspect: PropTypes.func,
        ontoggleArrowMode: PropTypes.func,
        onHeightChange: PropTypes.func,
        onLengthChange: PropTypes.func,
        onBarbLengthChange: PropTypes.func,
        onRadiusXChange: PropTypes.func,
        onRadiusYChange: PropTypes.func,
        onSelectArrowPreset: PropTypes.func,
        onAddArrowPreset: PropTypes.func,
        onSaveArrowPreset: PropTypes.func,
        onDeleteArrowPreset: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            isAspectChecked: this.props.lockAspectRatio
        };
        this.renderReferenceLine = this.renderReferenceLine.bind(this);
        this.renderArrow = this.renderArrow.bind(this);
        this.renderHandles = this.renderHandles.bind(this);
        this.handleArrowHandleDrag = this.handleArrowHandleDrag.bind(this);
        this.handleResetToPreset = this.handleResetToPreset.bind(this);
        this.handleHeightChange = this.handleHeightChange.bind(this);
        this.handleLengthChange = this.handleLengthChange.bind(this);
        this.handleBarbLengthChange = this.handleBarbLengthChange.bind(this);
        this.handleRadiusXChange = this.handleRadiusXChange.bind(this);
        this.handleRadiusYChange = this.handleRadiusYChange.bind(this);
        this.handleToggleAspect = this.handleToggleAspect.bind(this);
        this.handleToggleArrowMode = this.handleToggleArrowMode.bind(this);
        this.handleSelectArrowPreset = this.handleSelectArrowPreset.bind(this);
        this.handleAddArrowPreset = this.handleAddArrowPreset.bind(this);
        this.handleSaveArrowPreset = this.handleSaveArrowPreset.bind(this);
        this.handleDeleteArrowPreset = this.handleDeleteArrowPreset.bind(this);
    }

    handleResetToPreset() {
        this.props.onSelectArrowPreset(this.props.selectedArrow.preset);
    }

    handleHeightChange(value) {
        this.props.onHeightChange(parseInt(value, 10));
    }

    handleLengthChange(value) {
        this.props.onLengthChange(parseInt(value, 10));
    }

    handleBarbLengthChange(value) {
        this.props.onBarbLengthChange(parseInt(value, 10));
    }

    handleRadiusXChange(value) {
        this.props.onRadiusXChange(parseInt(value, 10));
    }

    handleRadiusYChange(value) {
        this.props.onRadiusYChange(parseInt(value, 10));
    }

    handleToggleAspect(event) {
        this.setState({isAspectChecked: !this.state.isAspectChecked});
        this.props.onToggleArrowAspect();
    }

    handleToggleArrowMode(value) {
        this.props.ontoggleArrowMode(value);
    }

    handleArrowHandleDrag(shapeId, handleIndex, draggableData) {
        this.props.onArrowHandleDrag(shapeId, handleIndex, draggableData);
    }

    handleSelectArrowPreset(value) {
        this.props.onSelectArrowPreset(value);
    }

    handleAddArrowPreset() {
        const { presetNames, selectedArrow } = this.props;
        const { dialog } = window.require('electron').remote;

        var name = document.getElementById("presetName").value;

        if (name === "") {
            dialog.showMessageBox({options: ["warning"], message: 'Please name your new arrow preset.'});
        } else if (presetNames.indexOf(name) === -1) {
            this.props.onAddArrowPreset(name, selectedArrow);
        } else {
            dialog.showMessageBox({options: ["warning"], message: "The name '" + name + "' is already taken. Please enter a different name for your new arrow preset."});
        }
    }

    handleSaveArrowPreset() {
        const { selectedArrow, defaultPresets } = this.props;
        const { dialog } = window.require('electron').remote;

        if (defaultPresets.indexOf(selectedArrow.preset) === -1) {
            this.props.onSaveArrowPreset(selectedArrow);
        } else {
            dialog.showMessageBox({options: ["warning"], message: 'You cannot update the default arrow preset, "' + selectedArrow.preset + '".'});
        }
    }

    handleDeleteArrowPreset() {
        const { selectedArrow, defaultPresets } = this.props;
        const { dialog } = window.require('electron').remote;

        if (defaultPresets.indexOf(selectedArrow.preset) === -1) {
            this.props.onDeleteArrowPreset(selectedArrow.preset);
        } else {
            dialog.showMessageBox({options: ["warning"], message: 'You cannot delete the default arrow preset, "' + selectedArrow.preset + '".'});
        }
    }

    generatePresetList() {
        return this.props.presetNames.map((preset) => {
            return <option key={preset} value={preset}>{preset}</option>;
        });
    }

    renderTypeSpecificInputs() {
        const { selectedArrow } = this.props;
        const { isAspectChecked } = this.state;

        switch (selectedArrow.type) {
            case "triangle":
            case "polyline":
                return (
                    <div className="editor-row">
                        <div className="editor-row-title">Size:</div>
                        <Input value={findHeightPercentage(selectedArrow)} label="Height %" style={{ width: 49, marginRight: 11 }} onChange={this.handleHeightChange} />
                        <Input value={findLengthPercentage(selectedArrow)} label="Length %" style={{ width: 49, marginRight: 21 }} onChange={this.handleLengthChange} />
                    </div>
                );
            case "barbed":
                return (
                    <div className="editor-row">
                        <div className="editor-row-title">Size:</div>
                        <Input value={findHeightPercentage(selectedArrow)} label="Height %" style={{ width: 49, marginRight: 11 }} onChange={this.handleHeightChange} />
                        <Input value={findLengthPercentage(selectedArrow)} label="Length %" style={{ width: 49, marginRight: 11 }} onChange={this.handleLengthChange} />
                        <Input value={findBarbLengthPercentage(selectedArrow)} label="Point as % of Length" style={{ width: 49, marginRight: 21 }} onChange={this.handleBarbLengthChange} />
                    </div>
                );
            case "ellipse":
                return (
                    <div className="editor-row">
                        <div className="editor-row-title">Size:</div>
                        <Input value={findRxPercentage(selectedArrow.rx)} label="RX %" style={{ width: 49, marginRight: 11 }} onChange={this.handleRadiusXChange} />
                        <Input value={findRyPercentage(selectedArrow.ry)} label="RY %" style={{ width: 49, marginRight: 21 }} onChange={this.handleRadiusYChange} />
                        <div className="editor-row-title">Lock:</div>
                        <input id="aspect" type="checkbox" onChange={this.handleToggleAspect} checked={isAspectChecked} />
                    </div>
                );
            case "rectangle":
                return (
                    <div className="editor-row">
                        <div className="editor-row-title">Size:</div>
                        <Input value={findHeightPercentage(selectedArrow)} label="Height %" style={{ width: 49, marginRight: 11 }} onChange={this.handleHeightChange} />
                        <Input value={findLengthPercentage(selectedArrow)} label="Length %" style={{ width: 49, marginRight: 21 }} onChange={this.handleLengthChange} />
                        <div className="editor-row-title">Lock:</div>
                        <input id="aspect" type="checkbox" onChange={this.handleToggleAspect} checked={isAspectChecked} />
                    </div>
                );
            default: break;
        }
    }

    renderReferenceLine(path, arrow) {
        var x2 = null;

        switch (arrow.type) {
            case "triangle":
                x2 = arrow.points[0];
                break;
            case "barbed":
                x2 = arrow.points[6];
                break;
            case "ellipse":
                x2 = arrow.cx - arrow.rx;
                break;
            case "rectangle":
                x2 = arrow.x;
                break;
            case "polyline":
                x2 = arrow.points[2];
                break;
            default: break;
        }

        return <line x1={0} y1={ARROW_GUI_HEIGHT / 2} x2={x2} y2={ARROW_GUI_HEIGHT / 2} strokeWidth={ARROW_STROKE_WIDTH} stroke={path.stroke} strokeDasharray={path.strokeDasharray} />;
    }

    renderArrow(arrow) {
        const { stroke } = this.props.path;

        const arrowProps = {
            ...arrow,
            fill: stroke,
            stroke
        };

        switch (arrow.type) {
            case 'triangle':
            case 'barbed':
                return <Polygon {...arrowProps} strokeWidth={0} />;
            case 'ellipse':
                return <Ellipse {...arrowProps} strokeWidth={0} />;
            case 'rectangle':
                return <Rectangle {...arrowProps} strokeWidth={0} />;
            case 'polyline':
                return <Polyline {...arrowProps} fillOpacity={0} />;
            default: break;
        }
    }

    renderHandles(arrow) {
        const { propagateEvents } = this.props;
        return arrow.handles.map((handle) => {
            const { id, index } = handle;
            const x = handle.x - 5;
            const y = handle.y - 5;
            let width = 10;
            let height = 10;

            return (
                <Handle
                    key={id}
                    id={id}
                    shapeId={arrow.id}
                    index={index}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    strokeWidth={2}
                    onDrag={this.handleArrowHandleDrag}
                    propagateEvents={propagateEvents}
                />
            );
        });
    }

    render() {
        const { path, selectedArrow, arrowMode, presetNames, defaultPresets } = this.props;

        var presetInputs = null;

        if (presetNames.length > defaultPresets.length) {
            presetInputs = <div className="editor-row">
                <button id="basic-button" onClick={this.handleSaveArrowPreset}>Update</button>
                <button id="basic-button" onClick={this.handleDeleteArrowPreset}>Delete</button>
            </div>;
        } else {
            presetInputs = <div />;
        }

        return (
            <div className="editor">
                <div className="editor-title">Arrow</div>
                <div className="editor-select-row">
                    <SelectRow value={arrowMode} onChange={this.handleToggleArrowMode}>
                        <div value={"head"} className="editor-button">Head</div>
                        <div value={"tail"} className="editor-button">Tail</div>
                    </SelectRow>
                </div>
                <div className="editor-row">
                    <div className="editor-row-title">Preset:</div>
                    <Select value={selectedArrow.preset} onChange={this.handleSelectArrowPreset}>
                        {this.generatePresetList()}
                    </Select>
                </div>
                <svg className="arrow-gui" style={{ width: ARROW_GUI_WIDTH, height: ARROW_GUI_HEIGHT }}>
                    {this.renderReferenceLine(path, selectedArrow)}
                    {this.renderArrow(selectedArrow)}
                    {this.renderHandles(selectedArrow)}
                </svg>
                {this.renderTypeSpecificInputs()}
                <div className="editor-row">
                    <input id="presetName" className='text-input' type="text" placeholder="name" style={{ width: 49, height: 16 }} />
                    <button id="basic-button" onClick={this.handleAddArrowPreset}>Add</button>
                    {presetInputs}
                </div>
            </div>
        );
    }
}

export default ArrowGUI;

// <button id="basic-button" onClick={this.handleResetToPreset}>Reset</button>
