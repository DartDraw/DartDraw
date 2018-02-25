import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './gui-editors.css';
import { Polygon, Ellipse, Rectangle, Polyline, Handle } from '../../drawing/shapes';

class ArrowheadGUI extends Component {
    static propTypes = {
        arrowheads: PropTypes.object,
        selectedPath: PropTypes.object,
        selectedArrowhead: PropTypes.object,
        lockAspectRatio: PropTypes.bool,
        presetNames: PropTypes.array,
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

    handleResetToDefault(event) {
        const { selectedArrowhead } = this.props;
        this.props.onChangeArrowheadType(selectedArrowhead.type);
        event.preventDefault();
    }

    handleResetToPreset(event) {
        const { selectedArrowhead } = this.props;
        this.props.onSelectArrowheadPreset(selectedArrowhead.preset);
        event.preventDefault();
    }

    handleHeightChange(event) {
        this.props.onHeightChange(parseInt(event.target.value, 10));
        event.preventDefault();
    }

    handleLengthChange(event) {
        this.props.onLengthChange(parseInt(event.target.value, 10));
        event.preventDefault();
    }

    handleBarbLengthChange(event) {
        this.props.onBarbLengthChange(parseInt(event.target.value, 10));
        event.preventDefault();
    }

    handleRadiusXChange(event) {
        this.props.onRadiusXChange(parseInt(event.target.value, 10));
        event.preventDefault();
    }

    handleRadiusYChange(event) {
        this.props.onRadiusYChange(parseInt(event.target.value, 10));
        event.preventDefault();
    }

    handleToggleFill(event) {
        this.setState({isFillChecked: !this.state.isFillChecked});
        this.props.onToggleArrowheadFill();
    }

    handleToggleAspect(event) {
        this.setState({isAspectChecked: !this.state.isAspectChecked});
        this.props.onToggleArrowheadAspect();
    }

    handleChangeArrowheadType(event) {
        this.props.onChangeArrowheadType(event.target.value);
        event.preventDefault();
    }

    handleArrowheadHandleDrag(shapeId, handleIndex, draggableData) {
        this.props.onArrowheadHandleDrag(shapeId, handleIndex, draggableData);
    }

    handleSelectArrowheadPreset(event) {
        this.props.onSelectArrowheadPreset(event.target.value);
        event.preventDefault();
    }

    handleAddArrowheadPreset(event) {
        const { presetNames, selectedArrowhead } = this.props;
        var name = document.getElementById("presetName").value;

        if (name === "") {
            console.error("Please name your new arrowhead preset.");
        } else if (presetNames.indexOf(name) === -1) {
            this.props.onAddArrowheadPreset(name, selectedArrowhead);
        } else {
            console.error("The name '%s' is already taken. Please enter a different name for your arrowhead preset.", name);
        }
        event.preventDefault();
    }

    handleSaveArrowheadPreset(event) {
        const { selectedArrowhead } = this.props;
        this.props.onSaveArrowheadPreset(selectedArrowhead);
        event.preventDefault();
    }

    handleDeleteArrowheadPreset(event) {
        const { preset } = this.props.selectedArrowhead;
        this.props.onDeleteArrowheadPreset(preset);
        event.preventDefault();
    }

    renderArrowheadPresets() {
        const { presetNames, selectedArrowhead } = this.props;

        if (presetNames.length > 0) {
            let list = [];

            presetNames.map((presetName) => {
                list.push(<option key={presetName} value={presetName}>{presetName}</option>);
            });

            return (
                <div>

                    <label>Saved Arrowhead Presets: </label>
                    <select id="selectPreset" value={selectedArrowhead.preset} onChange={this.handleSelectArrowheadPreset}>
                        {list}
                    </select>
                    <input
                        id="resetPreset"
                        type="button"
                        onClick={this.handleResetToPreset}
                        value="Restore Preset"
                    />
                </div>
            );
        }
    }

    renderHeightInput(defaultValue) {
        return (
            <div>
                <label>Arrowhead Height: </label>
                <input
                    id="height"
                    defaultValue={defaultValue}
                    type="number"
                    onChange={this.handleHeightChange}
                />
            </div>
        );
    }

    renderLengthInput(defaultValue) {
        return (
            <div>
                <label>Arrowhead Length: </label>
                <input
                    id="length"
                    defaultValue={defaultValue}
                    type="number"
                    onChange={this.handleLengthChange}
                />
            </div>
        );
    }

    renderBarbLengthInput(defaultValue) {
        return (
            <div>
                <label>Barb Length: </label>
                <input
                    id="barbLength"
                    defaultValue={defaultValue}
                    type="number"
                    onChange={this.handleBarbLengthChange}
                />
            </div>
        );
    }

    renderRadiusXInput(defaultValue) {
        return (
            <div>
                <label>RadiusX: </label>
                <input
                    id="radiusX"
                    defaultValue={defaultValue}
                    type="number"
                    onChange={this.handleRadiusXChange}
                />
            </div>
        );
    }

    renderRadiusYInput(defaultValue) {
        return (
            <div>
                <label>RadiusY: </label>
                <input
                    id="radiusY"
                    defaultValue={defaultValue}
                    type="number"
                    onChange={this.handleRadiusYChange}
                />
            </div>
        );
    }

    renderFillCheckbox() {
        const { isFillChecked } = this.state;

        return (
            <div>
                <label>Fill: </label>
                <input
                    id="fill"
                    type="checkbox"
                    onChange={this.handleToggleFill}
                    checked={isFillChecked}
                />
            </div>
        );
    }

    renderAspectCheckbox() {
        const { isAspectChecked } = this.state;

        return (
            <div>
                <label>Lock Aspect: </label>
                <input
                    id="aspect"
                    type="checkbox"
                    onChange={this.handleToggleAspect}
                    checked={isAspectChecked}
                />
            </div>
        );
    }

    renderArrowheadInputs() {
        const { selectedArrowhead } = this.props;

        switch (selectedArrowhead.type) {
            case "triangle":
                return (
                    <form id="form">
                        {this.renderHeightInput(Math.abs(selectedArrowhead.points[5] - selectedArrowhead.points[1]))}
                        {this.renderLengthInput(selectedArrowhead.points[2] - selectedArrowhead.points[0])}
                        {this.renderFillCheckbox()}
                    </form>
                );
            case "barbed":
                return (
                    <form id="form">
                        {this.renderHeightInput(Math.abs(selectedArrowhead.points[5] - selectedArrowhead.points[1]))}
                        {this.renderLengthInput(selectedArrowhead.points[2] - selectedArrowhead.points[0])}
                        {this.renderBarbLengthInput(selectedArrowhead.points[6] - selectedArrowhead.points[0])}
                        {this.renderFillCheckbox()}
                    </form>
                );
            case "ellipse":
                return (
                    <form id="form">
                        {this.renderRadiusXInput(selectedArrowhead.rx)}
                        {this.renderRadiusYInput(selectedArrowhead.ry)}
                        {this.renderAspectCheckbox()}
                        {this.renderFillCheckbox()}
                    </form>
                );
            case "rectangle":
                return (
                    <form id="form">
                        {this.renderHeightInput(selectedArrowhead.height)}
                        {this.renderLengthInput(selectedArrowhead.width)}
                        {this.renderAspectCheckbox()}
                        {this.renderFillCheckbox()}
                    </form>
                );
            case "polyline":
                return (
                    <form id="form">
                        {this.renderHeightInput(Math.abs(selectedArrowhead.points[5] - selectedArrowhead.points[1]))}
                        {this.renderLengthInput(selectedArrowhead.points[2] - selectedArrowhead.points[0])}
                    </form>
                );
            default: break;
        }
    }

    renderReferenceLine(selectedPath, arrowhead) {
        var x2;

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

        return <line x1={0} y1={75} x2={x2} y2={75} strokeWidth={10} stroke={selectedPath.stroke} strokeDasharray={selectedPath.strokeDasharray} />;
    }

    renderArrowhead(arrowhead) {
        const { stroke } = this.props.selectedPath;

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
        const { selectedPath, selectedArrowhead, arrowheads } = this.props;

        const arrowheadInputs = this.renderArrowheadInputs();
        const presetDropdown = this.renderArrowheadPresets();

        const showPresets = Object.keys(arrowheads.presets).length !== 0;

        return (
            <div style={{flex: 1, overflow: 'hidden'}}>
                <label>Arrowhead Type: </label>
                <select
                    id="type"
                    defaultValue={selectedArrowhead.type}
                    onChange={this.handleChangeArrowheadType}
                >
                    <option value='triangle'>triangle</option>
                    <option value='barbed'>barbed</option>
                    <option value='ellipse'>ellipse</option>
                    <option value='rectangle'>rectangle</option>
                    <option value='polyline'>polyline</option>
                </select>
                <svg className="arrowhead-gui">
                    {this.renderReferenceLine(selectedPath, selectedArrowhead)}
                    {this.renderArrowhead(selectedArrowhead)}
                    {this.renderHandles(selectedArrowhead)}
                </svg>
                <input
                    id="resetDefault"
                    type="button"
                    onClick={this.handleResetToDefault}
                    value="Restore Default"
                />
                {arrowheadInputs}
                <input
                    id="presetName"
                    type="text"
                    placeholder="name this arrowhead"
                />
                <input
                    type="submit"
                    onClick={this.handleAddArrowheadPreset}
                    value="Add +"
                />
                <input
                    id="save"
                    type="button"
                    onClick={this.handleSaveArrowheadPreset}
                    value="Save"
                    style={{flexDirection: 'row', display: showPresets ? 'flex' : 'none'}}
                />
                <input
                    id="delete"
                    type="button"
                    onClick={this.handleDeleteArrowheadPreset}
                    value="Delete"
                    style={{flexDirection: 'row', display: showPresets ? 'flex' : 'none'}}
                />
                {presetDropdown}
            </div>
        );
    }
}

export default ArrowheadGUI;
