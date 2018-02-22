import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './gui-editors.css';
import { Polygon, Ellipse, Rectangle, Polyline, Handle } from '../../drawing/shapes';

class ArrowheadGUI extends Component {
    static propTypes = {
        arrowheads: PropTypes.object,
        selectedPath: PropTypes.object,
        fillColor: PropTypes.object,
        currentArrowhead: PropTypes.object,
        arrowheadPresets: PropTypes.array,
        propagateEvents: PropTypes.bool,
        onArrowheadHandleDrag: PropTypes.func,
        onApplyArrowhead: PropTypes.func,
        onChangeArrowheadType: PropTypes.func,
        onEditArrowhead: PropTypes.func,
        onHeightChange: PropTypes.func,
        onLengthChange: PropTypes.func,
        onBarbLengthChange: PropTypes.func,
        onRadiusXChange: PropTypes.func,
        onRadiusYChange: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            isChecked: this.props.currentArrowhead.fillOpacity === 1
        };

        this.renderReferenceLine = this.renderReferenceLine.bind(this);
        this.renderArrowhead = this.renderArrowhead.bind(this);
        this.renderHandles = this.renderHandles.bind(this);
        this.handleArrowheadHandleDrag = this.handleArrowheadHandleDrag.bind(this);
        this.handleChangeArrowheadType = this.handleChangeArrowheadType.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleApplyArrowhead = this.handleApplyArrowhead.bind(this);
        this.handleHeightChange = this.handleHeightChange.bind(this);
        this.handleLengthChange = this.handleLengthChange.bind(this);
        this.handleBarbLengthChange = this.handleBarbLengthChange.bind(this);
        this.handleRadiusXChange = this.handleRadiusXChange.bind(this);
        this.handleRadiusYChange = this.handleRadiusYChange.bind(this);
        this.handleToggleFill = this.handleToggleFill.bind(this);
    }

    componentWillMount() {
        const { arrowheads, selectedPath } = this.props;

        // set currentArrowhead to be the same as the selected path's arrowhead
        this.props.onEditArrowhead(arrowheads.byId[selectedPath.arrowheadId]);
    }

    handleReset(event) {
        this.props.onChangeArrowheadType(this.props.currentArrowhead.type);
        event.preventDefault();
    }

    handleApplyArrowhead(event) {
        const { currentArrowhead, selectedPath } = this.props;
        this.props.onApplyArrowhead(currentArrowhead, selectedPath);
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
        console.log(event.target.value);
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
        this.setState({isChecked: !this.state.isChecked});

        const newArrowhead = Object.assign({}, this.props.currentArrowhead, { fillOpacity: this.state.isChecked ? 0 : 1 });
        this.props.onEditArrowhead(newArrowhead);
    }

    handleChangeArrowheadType(event) {
        this.props.onChangeArrowheadType(event.target.value);
        event.preventDefault();
    }

    handleArrowheadHandleDrag(shapeId, handleIndex, draggableData) {
        this.props.onArrowheadHandleDrag(shapeId, handleIndex, draggableData);
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
        const { isChecked } = this.state;

        return (
            <div>
                <label>Fill: </label>
                <input
                    id="fill"
                    type="checkbox"
                    onChange={this.handleToggleFill}
                    checked={isChecked}
                />
            </div>
        );
    }

    renderArrowheadInputs() {
        const { currentArrowhead } = this.props;

        switch (currentArrowhead.type) {
            case "triangle":
                return (
                    <form id="form">
                        {this.renderHeightInput(Math.abs(currentArrowhead.points[5] - currentArrowhead.points[1]))}
                        {this.renderLengthInput(currentArrowhead.points[2] - currentArrowhead.points[0])}
                        {this.renderFillCheckbox()}
                    </form>
                );
            case "barbed":
                return (
                    <form id="form">
                        {this.renderHeightInput(Math.abs(currentArrowhead.points[5] - currentArrowhead.points[1]))}
                        {this.renderLengthInput(currentArrowhead.points[2] - currentArrowhead.points[0])}
                        {this.renderBarbLengthInput(currentArrowhead.points[6] - currentArrowhead.points[0])}
                        {this.renderFillCheckbox()}
                    </form>
                );
            case "ellipse":
                return (
                    <form id="form">
                        {this.renderRadiusXInput(currentArrowhead.rx)}
                        {this.renderRadiusYInput(currentArrowhead.ry)}
                        {this.renderFillCheckbox()}
                    </form>
                );
            case "rectangle":
                return (
                    <form id="form">
                        {this.renderHeightInput(currentArrowhead.height)}
                        {this.renderLengthInput(currentArrowhead.width)}
                        {this.renderFillCheckbox()}
                    </form>
                );
            case "polyline":
                return (
                    <form id="form">
                        {this.renderHeightInput(Math.abs(currentArrowhead.points[5] - currentArrowhead.points[1]))}
                        {this.renderLengthInput(currentArrowhead.points[2] - currentArrowhead.points[0])}
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

        return <line x1={0} y1={75} x2={x2} y2={75} strokeWidth={5} stroke={selectedPath.stroke} strokeDasharray={selectedPath.strokeDasharray} />;
    }

    renderArrowhead(arrowhead) {
        const { stroke } = this.props.selectedPath;

        const arrowheadProps = {
            ...arrowhead,
            transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}],
            fill: stroke,
            stroke: stroke,
            strokeWidth: 5
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
        const { selectedPath, currentArrowhead } = this.props;

        const arrowheadInputs = this.renderArrowheadInputs();

        return (
            <div style={{flex: 1, overflow: 'hidden'}}>
                <label>Arrowhead Type: </label>
                <select
                    id="type"
                    defaultValue={currentArrowhead.type}
                    onChange={this.handleChangeArrowheadType}
                >
                    <option value='triangle'>triangle</option>
                    <option value='barbed'>barbed</option>
                    <option value='ellipse'>ellipse</option>
                    <option value='rectangle'>rectangle</option>
                    <option value='polyline'>polyline</option>
                </select>
                <svg className="arrowhead-gui">
                    {this.renderReferenceLine(selectedPath, currentArrowhead)}
                    {this.renderArrowhead(currentArrowhead)}
                    {this.renderHandles(currentArrowhead)}
                </svg>
                <input
                    id="reset"
                    type="button"
                    onClick={this.handleReset}
                    value="Reset to Default"
                />
                {arrowheadInputs}
                <input
                    id="apply"
                    type="button"
                    onClick={this.handleApplyArrowhead}
                    value="Apply"
                />
            </div>
        );
    }
}

export default ArrowheadGUI;
