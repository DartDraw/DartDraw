import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './gui-editors.css';
import { Polygon, Ellipse, Rectangle, Polyline, Handle } from '../../drawing/shapes';

class ArrowheadGUI extends Component {
    static propTypes = {
        selected: PropTypes.array,
        path: PropTypes.object,
        fillColor: PropTypes.object,
        currentArrowhead: PropTypes.object,
        arrowheadPresets: PropTypes.array,
        propagateEvents: PropTypes.bool,
        onArrowheadHandleDragStart: PropTypes.func,
        onArrowheadHandleDrag: PropTypes.func,
        onArrowheadHandleDragStop: PropTypes.func,
        onChangeArrowheadType: PropTypes.func,
        onEditArrowhead: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            isChecked: this.props.currentArrowhead.fillOpacity === 1
        };

        this.renderReferenceLine = this.renderReferenceLine.bind(this);
        this.renderArrowhead = this.renderArrowhead.bind(this);
        this.renderHandles = this.renderHandles.bind(this);
        this.handleArrowheadHandleDragStart = this.handleArrowheadHandleDragStart.bind(this);
        this.handleArrowheadHandleDrag = this.handleArrowheadHandleDrag.bind(this);
        this.handleArrowheadHandleDragStop = this.handleArrowheadHandleDragStop.bind(this);
        this.handleChangeArrowheadType = this.handleChangeArrowheadType.bind(this);
        this.handleXChange = this.handleXChange.bind(this);
        this.handleYChange = this.handleYChange.bind(this);
        this.handleToggleFill = this.handleToggleFill.bind(this);
    }

    handleXChange(event) {
        const { currentArrowhead } = this.props;
        const newArrowhead = Object.assign({}, currentArrowhead, { x: event.target.value });
        this.props.onEditArrowhead(newArrowhead);
    }

    handleYChange(event) {
        const { currentArrowhead } = this.props;
        const newArrowhead = Object.assign({}, currentArrowhead, { y: event.target.value });
        this.props.onEditArrowhead(newArrowhead);
    }

    handleToggleFill(event) {
        const { currentArrowhead } = this.props;
        const { isChecked } = this.state;
        const newArrowhead = Object.assign({}, currentArrowhead, { fillOpacity: isChecked ? 0 : 1 });
        this.props.onEditArrowhead(newArrowhead);
        this.setState({isChecked: !isChecked});
    }

    handleArrowheadHandleDragStart(shapeId, handleIndex, draggableData) {
        // should be arrowheadId not shapeID
        // console.log("start");
        this.props.onArrowheadHandleDragStart(shapeId, handleIndex, draggableData);
    }

    handleArrowheadHandleDrag(shapeId, handleIndex, draggableData) {
        // should be arrowheadId not shapeID
        // console.log("dragging");

        this.props.onArrowheadHandleDrag(shapeId, handleIndex, draggableData);
    }

    handleArrowheadHandleDragStop(shapeId, handleIndex, draggableData) {
        // console.log("stop");

        // should be arrowheadId not shapeID
        this.props.onArrowheadHandleDragStop(shapeId, handleIndex, draggableData);
    }

    handleChangeArrowheadType(event) {
        this.props.onChangeArrowheadType(event.target.value);
        event.preventDefault();
    }

    determineParameterMenu() {
        const { currentArrowhead } = this.props;
        const { isChecked } = this.state;

        switch (currentArrowhead.type) {
            case "triangle":
                return (
                    <form id="button-icon">
                        <input
                            id="width"
                            defaultValue={300 - (2 * currentArrowhead.points[0])}
                            type="number"
                            onChange={this.handleXChange}
                        />
                        <input
                            id="length"
                            defaultValue={currentArrowhead.points[2] - currentArrowhead.points[0]}
                            type="number"
                            onChange={this.handleYChange}
                        />
                        <input
                            id="fill"
                            type="checkbox"
                            onChange={this.handleToggleFill}
                            checked={isChecked}
                        />
                        <input id="submit" type="submit" value="submit" />
                    </form>
                );
            case "barbed":
                break;
            case "ellipse":
                break;
            case "rectangle":
                break;
            case "polyline":
                break;
            default: break;
        }
    }

    renderReferenceLine(path, arrowhead) {
        // update so it's not hardcoded!
        return <line x1={0} y1={75} x2={250} y2={75} strokeWidth={5} stroke={path.stroke} strokeDasharray={path.strokeDasharray} />;
    }

    renderArrowhead(arrowhead) {
        const { stroke, strokeDasharray } = this.props.path;

        const arrowheadProps = {
            ...arrowhead,
            transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}],
            fill: stroke,
            stroke: stroke,
            strokeWidth: 5,
            strokeDasharray: strokeDasharray
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
                    onDragStart={this.handleArrowheadHandleDragStart}
                    onDrag={this.handleArrowheadHandleDrag}
                    onDragStop={this.handleArrowheadHandleDragStop}
                    propagateEvents={propagateEvents}
                />
            );
        });
    }

    render() {
        const { path, currentArrowhead } = this.props;

        const parameterMenu = this.determineParameterMenu();

        return (
            <div style={{flex: 1, overflow: 'hidden'}}>
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
                    {this.renderReferenceLine(path, currentArrowhead)}
                    {this.renderArrowhead(currentArrowhead)}
                    {this.renderHandles(currentArrowhead)}
                </svg>
                {parameterMenu}
            </div>
        );
    }
}

export default ArrowheadGUI;
