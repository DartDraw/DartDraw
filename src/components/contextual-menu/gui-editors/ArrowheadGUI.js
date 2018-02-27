import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './gui-editors.css';
import { Input } from '../../ui';
import Dropdown from 'react-dropdown';
import { Polygon, Ellipse, Rectangle, Polyline, Handle } from '../../drawing/shapes';

class ArrowheadGUI extends Component {
    static propTypes = {
        arrowheads: PropTypes.object,
        path: PropTypes.object,
        selectedArrowhead: PropTypes.object,
        lockAspectRatio: PropTypes.bool,
        presetNames: PropTypes.array,
        typeNames: PropTypes.array,
        fillColor: PropTypes.object,
        propagateEvents: PropTypes.bool,
        onArrowheadHandleDrag: PropTypes.func,
        onApplyArrowhead: PropTypes.func,
        onChangeArrowheadType: PropTypes.func,
        onToggleArrowheadFill: PropTypes.func,
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
            isFillChecked: this.props.selectedArrowhead.fillOpacity === 1,
            isAspectChecked: this.props.lockAspectRatio
        };

        this.renderReferenceLine = this.renderReferenceLine.bind(this);
        this.renderArrowhead = this.renderArrowhead.bind(this);
        this.renderHandles = this.renderHandles.bind(this);
        this.handleArrowheadHandleDrag = this.handleArrowheadHandleDrag.bind(this);
        this.handleChangeArrowheadType = this.handleChangeArrowheadType.bind(this);
        this.handleResetToDefault = this.handleResetToDefault.bind(this);
        this.handleResetToPreset = this.handleResetToPreset.bind(this);
        this.handleHeightChange = this.handleHeightChange.bind(this);
        this.handleLengthChange = this.handleLengthChange.bind(this);
        this.handleBarbLengthChange = this.handleBarbLengthChange.bind(this);
        this.handleRadiusXChange = this.handleRadiusXChange.bind(this);
        this.handleRadiusYChange = this.handleRadiusYChange.bind(this);
        this.handleToggleFill = this.handleToggleFill.bind(this);
        this.handleToggleAspect = this.handleToggleAspect.bind(this);
        this.handleSelectArrowheadPreset = this.handleSelectArrowheadPreset.bind(this);
        this.handleAddArrowheadPreset = this.handleAddArrowheadPreset.bind(this);
        this.handleSaveArrowheadPreset = this.handleSaveArrowheadPreset.bind(this);
        this.handleDeleteArrowheadPreset = this.handleDeleteArrowheadPreset.bind(this);
    }

    handleResetToDefault() {
        const { selectedArrowhead } = this.props;
        this.props.onChangeArrowheadType(selectedArrowhead.type);
    }

    handleResetToPreset() {
        const { selectedArrowhead } = this.props;
        this.props.onSelectArrowheadPreset(selectedArrowhead.preset);
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

    handleToggleFill(event) {
        this.setState({isFillChecked: !this.state.isFillChecked});
        this.props.onToggleArrowheadFill();
    }

    handleToggleAspect(event) {
        this.setState({isAspectChecked: !this.state.isAspectChecked});
        this.props.onToggleArrowheadAspect();
    }

    handleArrowheadHandleDrag(shapeId, handleIndex, draggableData) {
        this.props.onArrowheadHandleDrag(shapeId, handleIndex, draggableData);
    }

    handleSelectArrowheadPreset(preset) {
        this.props.onSelectArrowheadPreset(preset.value);
    }

    handleChangeArrowheadType(type) {
        this.props.onChangeArrowheadType(type.value);
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
        const { selectedArrowhead } = this.props;
        if (selectedArrowhead.preset) {
            this.props.onSaveArrowheadPreset(selectedArrowhead);
        }
    }

    handleDeleteArrowheadPreset() {
        const { selectedArrowhead } = this.props;
        if (selectedArrowhead.preset) {
            this.props.onDeleteArrowheadPreset(selectedArrowhead.preset);
        }
    }

    renderTypeSpecificInputs() {
        const { selectedArrowhead } = this.props;
        const { isFillChecked, isAspectChecked } = this.state;

        switch (selectedArrowhead.type) {
            case "triangle":
                return (
                    <div className="editor-row">
                        <div className="editor-row-title">Size:</div>
                        <Input value={Math.abs(selectedArrowhead.points[5] - selectedArrowhead.points[1])} label="Height" style={{ width: 49, marginRight: 11 }} onChange={this.handleHeightChange} />
                        <Input value={selectedArrowhead.points[2] - selectedArrowhead.points[0]} label="Length" style={{ width: 49, marginRight: 21 }} onChange={this.handleLengthChange} />
                        <div className="editor-row-title">Fill:</div>
                        <input id="fill" type="checkbox" onChange={this.handleToggleFill} checked={isFillChecked} />
                    </div>
                );
            case "barbed":
                return (
                    <div className="editor-row">
                        <div className="editor-row-title">Size:</div>
                        <Input value={Math.abs(selectedArrowhead.points[5] - selectedArrowhead.points[1])} label="Height" style={{ width: 49, marginRight: 11 }} onChange={this.handleHeightChange} />
                        <Input value={selectedArrowhead.points[2] - selectedArrowhead.points[0]} label="Length" style={{ width: 49, marginRight: 11 }} onChange={this.handleLengthChange} />
                        <Input value={selectedArrowhead.points[6] - selectedArrowhead.points[0]} label="Barb Length" style={{ width: 49, marginRight: 21 }} onChange={this.handleBarbLengthChange} />
                        <div className="editor-row-title">Fill:</div>
                        <input id="fill" type="checkbox" onChange={this.handleToggleFill} checked={isFillChecked} />
                    </div>
                );
            case "ellipse":
                return (
                    <div className="editor-row">
                        <div className="editor-row-title">Size:</div>
                        <Input value={selectedArrowhead.rx} label="RX" style={{ width: 49, marginRight: 11 }} onChange={this.handleRadiusXChange} />
                        <Input value={selectedArrowhead.ry} label="RY" style={{ width: 49, marginRight: 21 }} onChange={this.handleRadiusYChange} />
                        <div className="editor-row-title">Fill:</div>
                        <input id="fill" type="checkbox" onChange={this.handleToggleFill} checked={isFillChecked} />
                        <div className="editor-row-title">Lock:</div>
                        <input id="aspect" type="checkbox" onChange={this.handleToggleAspect} checked={isAspectChecked} />
                    </div>
                );
            case "rectangle":
                return (
                    <div className="editor-row">
                        <div className="editor-row-title">Size:</div>
                        <Input value={selectedArrowhead.height} label="Height" style={{ width: 49, marginRight: 11 }} onChange={this.handleHeightChange} />
                        <Input value={selectedArrowhead.width} label="Length" style={{ width: 49, marginRight: 21 }} onChange={this.handleLengthChange} />
                        <div className="editor-row-title">Fill:</div>
                        <input id="fill" type="checkbox" onChange={this.handleToggleFill} style={{ marginRight: 21 }} checked={isFillChecked} />
                        <div className="editor-row-title">Lock:</div>
                        <input id="aspect" type="checkbox" onChange={this.handleToggleAspect} checked={isAspectChecked} />
                    </div>
                );
            case "polyline":
                return (
                    <div className="editor-row">
                        <div className="editor-row-title">Size:</div>
                        <Input value={Math.abs(selectedArrowhead.points[5] - selectedArrowhead.points[1])} label="Height" style={{ width: 49, marginRight: 11 }} onChange={this.handleHeightChange} />
                        <Input value={selectedArrowhead.points[2] - selectedArrowhead.points[0]} label="Length" style={{ width: 49, marginRight: 21 }} onChange={this.handleLengthChange} />
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

        return <line x1={0} y1={75} x2={x2} y2={75} strokeWidth={10} stroke={path.stroke} strokeDasharray={path.strokeDasharray} />;
    }

    renderArrowhead(arrowhead) {
        const { stroke } = this.props.path;

        const arrowheadProps = {
            ...arrowhead,
            transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}],
            fill: stroke,
            stroke: stroke,
            strokeWidth: 10
        };

        switch (arrowhead.type) {
            case 'triangle':
            case 'barbed':
                return <Polygon {...arrowheadProps} />;
            case 'ellipse':
                return <Ellipse {...arrowheadProps} />;
            case 'rectangle':
                return <Rectangle {...arrowheadProps} />;
            case 'polyline':
                return <Polyline {...arrowheadProps} />;
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
        const { path, selectedArrowhead, presetNames, typeNames } = this.props;

        var presetInputs = null;

        if (presetNames.length > 0) {
            presetInputs = <div className="editor-row">
                <button id="basic-button" onClick={this.handleSaveArrowheadPreset}>Save</button>
                <button id="basic-button" onClick={this.handleDeleteArrowheadPreset}>Delete</button>
                <Dropdown options={presetNames} onChange={(e) => { this.handleSelectArrowheadPreset(e); }} value={selectedArrowhead.preset} placeholder="Select an option" />
            </div>;
            // <button id="basic-button" onClick={this.handleResetToPreset}>Reset to Preset</button>
        } else {
            presetInputs = <div />;
        }

        return (
            <div className="editor">
                <div className="editor-row">
                    <div className="editor-row-title">Type:</div>
                    <Dropdown options={typeNames} onChange={(e) => { this.handleChangeArrowheadType(e); }} value={selectedArrowhead.type} />
                    <button id="basic-button" onClick={this.handleResetToDefault}>Reset</button>
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
