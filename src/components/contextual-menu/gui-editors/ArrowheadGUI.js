import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './gui-editors.css';
import { Input, Select } from '../../ui';
import { ARROWHEAD_STROKE_WIDTH } from '../../../constants';
import {findHeightPercentage, findLengthPercentage, findBarbLengthPercentage, findRxPercentage, findRyPercentage} from '../../../reducers/utilities/arrowhead';
import { Polygon, Ellipse, Rectangle, Polyline, Handle } from '../../drawing/shapes';

class ArrowheadGUI extends Component {
    static propTypes = {
        arrowheads: PropTypes.object,
        path: PropTypes.object,
        selectedArrowhead: PropTypes.object,
        lockAspectRatio: PropTypes.bool,
        presetNames: PropTypes.array,
        defaultPresets: PropTypes.array,
        propagateEvents: PropTypes.bool,
        onArrowheadHandleDrag: PropTypes.func,
        onApplyArrowhead: PropTypes.func,
        onToggleArrowheadAspect: PropTypes.func,
        onHeightChange: PropTypes.func,
        onLengthChange: PropTypes.func,
        onBarbLengthChange: PropTypes.func,
        onRadiusXChange: PropTypes.func,
        onRadiusYChange: PropTypes.func,
        onSelectArrowheadPreset: PropTypes.func,
        onAddArrowheadPreset: PropTypes.func,
        onSaveArrowheadPreset: PropTypes.func,
        onDeleteArrowheadPreset: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            isAspectChecked: this.props.lockAspectRatio
        };

        this.renderReferenceLine = this.renderReferenceLine.bind(this);
        this.renderArrowhead = this.renderArrowhead.bind(this);
        this.renderHandles = this.renderHandles.bind(this);
        this.handleArrowheadHandleDrag = this.handleArrowheadHandleDrag.bind(this);
        this.handleResetToPreset = this.handleResetToPreset.bind(this);
        this.handleHeightChange = this.handleHeightChange.bind(this);
        this.handleLengthChange = this.handleLengthChange.bind(this);
        this.handleBarbLengthChange = this.handleBarbLengthChange.bind(this);
        this.handleRadiusXChange = this.handleRadiusXChange.bind(this);
        this.handleRadiusYChange = this.handleRadiusYChange.bind(this);
        this.handleToggleAspect = this.handleToggleAspect.bind(this);
        this.handleSelectArrowheadPreset = this.handleSelectArrowheadPreset.bind(this);
        this.handleAddArrowheadPreset = this.handleAddArrowheadPreset.bind(this);
        this.handleSaveArrowheadPreset = this.handleSaveArrowheadPreset.bind(this);
        this.handleDeleteArrowheadPreset = this.handleDeleteArrowheadPreset.bind(this);
    }

    handleResetToPreset() {
        this.props.onSelectArrowheadPreset(this.props.selectedArrowhead.preset);
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
        this.props.onToggleArrowheadAspect();
    }

    handleArrowheadHandleDrag(shapeId, handleIndex, draggableData) {
        this.props.onArrowheadHandleDrag(shapeId, handleIndex, draggableData);
    }

    handleSelectArrowheadPreset(value) {
        this.props.onSelectArrowheadPreset(value);
    }

    handleAddArrowheadPreset() {
        const { presetNames, selectedArrowhead } = this.props;
        const { dialog } = window.require('electron').remote;

        var name = document.getElementById("presetName").value;

        if (name === "") {
            dialog.showMessageBox({options: ["warning"], message: 'Please name your new arrowhead preset.'});
        } else if (presetNames.indexOf(name) === -1) {
            this.props.onAddArrowheadPreset(name, selectedArrowhead);
        } else {
            dialog.showMessageBox({options: ["warning"], message: "The name '" + name + "' is already taken. Please enter a different name for your new arrowhead preset."});
        }
    }

    handleSaveArrowheadPreset() {
        const { selectedArrowhead, defaultPresets } = this.props;
        const { dialog } = window.require('electron').remote;

        if (defaultPresets.indexOf(selectedArrowhead.preset) === -1) {
            this.props.onSaveArrowheadPreset(selectedArrowhead);
        } else {
            dialog.showMessageBox({options: ["warning"], message: 'You cannot update the default arrowhead preset, "' + selectedArrowhead.preset + '".'});
        }
    }

    handleDeleteArrowheadPreset() {
        const { selectedArrowhead, defaultPresets } = this.props;
        const { dialog } = window.require('electron').remote;

        if (defaultPresets.indexOf(selectedArrowhead.preset) === -1) {
            this.props.onDeleteArrowheadPreset(selectedArrowhead.preset);
        } else {
            dialog.showMessageBox({options: ["warning"], message: 'You cannot delete the default arrowhead preset, "' + selectedArrowhead.preset + '".'});
        }
    }

    generatePresetList() {
        return this.props.presetNames.map((preset) => {
            return <option key={preset} value={preset}>{preset}</option>;
        });
    }

    renderTypeSpecificInputs() {
        const { selectedArrowhead } = this.props;
        const { isAspectChecked } = this.state;

        switch (selectedArrowhead.type) {
            case "triangle":
            case "polyline":
                return (
                    <div className="editor-row">
                        <div className="editor-row-title">Size:</div>
                        <Input value={findHeightPercentage(selectedArrowhead)} label="Height %" style={{ width: 49, marginRight: 11 }} onChange={this.handleHeightChange} />
                        <Input value={findLengthPercentage(selectedArrowhead)} label="Length %" style={{ width: 49, marginRight: 21 }} onChange={this.handleLengthChange} />
                    </div>
                );
            case "barbed":
                return (
                    <div className="editor-row">
                        <div className="editor-row-title">Size:</div>
                        <Input value={findHeightPercentage(selectedArrowhead)} label="Height %" style={{ width: 49, marginRight: 11 }} onChange={this.handleHeightChange} />
                        <Input value={findLengthPercentage(selectedArrowhead)} label="Length %" style={{ width: 49, marginRight: 11 }} onChange={this.handleLengthChange} />
                        <Input value={findBarbLengthPercentage(selectedArrowhead)} label="Point as % of Length" style={{ width: 49, marginRight: 21 }} onChange={this.handleBarbLengthChange} />
                    </div>
                );
            case "ellipse":
                return (
                    <div className="editor-row">
                        <div className="editor-row-title">Size:</div>
                        <Input value={findRxPercentage(selectedArrowhead.rx)} label="RX %" style={{ width: 49, marginRight: 11 }} onChange={this.handleRadiusXChange} />
                        <Input value={findRyPercentage(selectedArrowhead.ry)} label="RY %" style={{ width: 49, marginRight: 21 }} onChange={this.handleRadiusYChange} />
                        <div className="editor-row-title">Lock:</div>
                        <input id="aspect" type="checkbox" onChange={this.handleToggleAspect} checked={isAspectChecked} />
                    </div>
                );
            case "rectangle":
                return (
                    <div className="editor-row">
                        <div className="editor-row-title">Size:</div>
                        <Input value={findHeightPercentage(selectedArrowhead)} label="Height %" style={{ width: 49, marginRight: 11 }} onChange={this.handleHeightChange} />
                        <Input value={findLengthPercentage(selectedArrowhead)} label="Length %" style={{ width: 49, marginRight: 21 }} onChange={this.handleLengthChange} />
                        <div className="editor-row-title">Lock:</div>
                        <input id="aspect" type="checkbox" onChange={this.handleToggleAspect} checked={isAspectChecked} />
                    </div>
                );
            default: break;
        }
    }

    renderReferenceLine(path, arrowhead) {
        var x2 = null;

        switch (arrowhead.type) {
            case "triangle":
                x2 = arrowhead.points[0];
                break;
            case "barbed":
                x2 = arrowhead.points[6];
                break;
            case "ellipse":
                x2 = arrowhead.cx - arrowhead.rx;
                break;
            case "rectangle":
                x2 = arrowhead.x;
                break;
            case "polyline":
                x2 = arrowhead.points[2];
                break;
            default: break;
        }

        return <line x1={0} y1={75} x2={x2} y2={75} strokeWidth={ARROWHEAD_STROKE_WIDTH} stroke={path.stroke} strokeDasharray={path.strokeDasharray} />;
    }

    renderArrowhead(arrowhead) {
        const { stroke } = this.props.path;

        const arrowheadProps = {
            ...arrowhead,
            fill: stroke,
            stroke
        };

        switch (arrowhead.type) {
            case 'triangle':
            case 'barbed':
                return <Polygon {...arrowheadProps} strokeWidth={0} />;
            case 'ellipse':
                return <Ellipse {...arrowheadProps} strokeWidth={0} />;
            case 'rectangle':
                return <Rectangle {...arrowheadProps} strokeWidth={0} />;
            case 'polyline':
                return <Polyline {...arrowheadProps} fillOpacity={0} />;
            default: break;
        }
    }

    renderHandles(arrowhead) {
        const { propagateEvents } = this.props;
        return arrowhead.handles.map((handle) => {
            const { id, index } = handle;
            const x = handle.x - 5;
            const y = handle.y - 5;
            let width = 10;
            let height = 10;

            return (
                <Handle
                    key={id}
                    id={id}
                    shapeId={arrowhead.id}
                    index={index}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    strokeWidth={2}
                    onDrag={this.handleArrowheadHandleDrag}
                    propagateEvents={propagateEvents}
                />
            );
        });
    }

    render() {
        const { path, selectedArrowhead, presetNames, defaultPresets } = this.props;

        var presetInputs = null;

        if (presetNames.length > defaultPresets.length) {
            presetInputs = <div className="editor-row">
                <button id="basic-button" onClick={this.handleSaveArrowheadPreset}>Update</button>
                <button id="basic-button" onClick={this.handleDeleteArrowheadPreset}>Delete</button>
            </div>;
        } else {
            presetInputs = <div />;
        }

        return (
            <div className="editor">
                <div className="editor-row">
                    <div className="editor-row-title">Selected Arrowhead:</div>
                    <Select value={selectedArrowhead.preset} onChange={this.handleSelectArrowheadPreset}>
                        {this.generatePresetList()}
                    </Select>
                    <button id="basic-button" onClick={this.handleResetToPreset}>Reset</button>
                </div>
                <svg className="arrowhead-gui">
                    {this.renderReferenceLine(path, selectedArrowhead)}
                    {this.renderArrowhead(selectedArrowhead)}
                    {this.renderHandles(selectedArrowhead)}
                </svg>
                {this.renderTypeSpecificInputs()}
                <div className="editor-row">
                    <input id="presetName" className='text-input' type="text" placeholder="name" style={{ width: 49 }} />
                    <button id="basic-button" onClick={this.handleAddArrowheadPreset}>Add</button>
                    {presetInputs}
                </div>
            </div>
        );
    }
}

export default ArrowheadGUI;
