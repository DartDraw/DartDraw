import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './gui-editors.css';
import { Polygon, Handle } from '../../drawing/shapes';

class ArrowheadGUI extends Component {
    static propTypes = {
        selected: PropTypes.array,
        path: PropTypes.object,
        currentArrowhead: PropTypes.object,
        arrowheadPresets: PropTypes.array,
        propagateEvents: PropTypes.bool,
        onArrowheadHandleDragStart: PropTypes.func,
        onArrowheadHandleDrag: PropTypes.func,
        onArrowheadHandleDragStop: PropTypes.func,
        onChangeArrowheadType: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.renderReferenceLine = this.renderReferenceLine.bind(this);
        this.renderArrowhead = this.renderArrowhead.bind(this);
        this.renderHandles = this.renderHandles.bind(this);
        this.handleArrowheadHandleDragStart = this.handleArrowheadHandleDragStart.bind(this);
        this.handleArrowheadHandleDrag = this.handleArrowheadHandleDrag.bind(this);
        this.handleArrowheadHandleDragStop = this.handleArrowheadHandleDragStop.bind(this);
        this.handleChangeArrowheadType = this.handleChangeArrowheadType.bind(this);
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

    renderReferenceLine(path, arrowhead) {
        // update so it's not hardcoded!
        return <line x1={0} y1={75} x2={arrowhead.points[0]} y2={75} strokeWidth={path.strokeWidth} stroke={path.stroke} strokeDasharray={path.strokeDasharray} />;
    }

    renderArrowhead(arrowhead) {
        const { stroke, strokeWidth, strokeDasharray } = this.props.path;

        const arrowheadProps = {
            // id: uuidv1(),
            type: 'polyline',
            points: arrowhead.points,
            transform: [{command: 'matrix', parameters: [1, 0, 0, 1, 0, 0]}],
            fill: stroke,
            strokeWidth: strokeWidth,
            strokeDasharray: strokeDasharray
        };

        return <Polygon {...arrowheadProps} />;
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

        return (
            <div style={{flex: 1, overflow: 'hidden'}}>
                <select
                    id="type"
                    defaultValue={currentArrowhead.type}
                    onChange={this.handleChangeArrowheadType}
                >
                    <option value="triangle">triangle</option>
                    <option value="barbed">barbed</option>
                    <option value="circle">circle</option>
                    <option value="square">square</option>
                    <option value="line">line</option>
                </select>
                <svg className="arrowhead-gui">
                    {this.renderReferenceLine(path, currentArrowhead)}
                    {this.renderArrowhead(currentArrowhead)}
                    {this.renderHandles(currentArrowhead)}
                </svg>
            </div>
        );
    }
}

export default ArrowheadGUI;

// <form id="button-icon" onSubmit={() => console.log("hi")}>
//     <input
//         id="width"
//         defaultValue={300 - (2 * arrowhead.points[0])}
//         type="number"
//     />
//     <input
//         id="length"
//         defaultValue={arrowhead.points[2] - arrowhead.points[0]}
//         type="number"
//     />
//     <input
//         id="strokeWidth"
//         defaultValue={path.strokeWidth}
//         type="number"
//     />
//     <input type="checkbox" />
//     <input type="submit" value="submit" />
// </form>
