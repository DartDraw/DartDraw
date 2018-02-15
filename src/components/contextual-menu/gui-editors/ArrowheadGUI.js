import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './gui-editors.css';
import { Polygon, Handle } from '../../drawing/shapes';

class ArrowheadGUI extends Component {
    static propTypes = {
        shapes: PropTypes.array,
        arrows: PropTypes.array,
        selected: PropTypes.array,
        path: PropTypes.object,
        arrowhead: PropTypes.object,
        propagateEvents: PropTypes.bool,
        onHandleDragStart: PropTypes.func,
        onHandleDrag: PropTypes.func,
        onHandleDragStop: PropTypes.func
    };

    constructor(props) {
        super(props);

        // this.renderDrawing = this.renderDrawing.bind(this);
        // this.renderArrows = this.renderArrows.bind(this);
        this.renderReferenceLine = this.renderReferenceLine.bind(this);
        this.renderArrowhead = this.renderArrowhead.bind(this);
        this.renderHandles = this.renderHandles.bind(this);
        this.handleHandleDragStart = this.handleHandleDragStart.bind(this);
        this.handleHandleDrag = this.handleHandleDrag.bind(this);
        this.handleHandleDragStop = this.handleHandleDragStop.bind(this);
    }

    handleHandleDragStart(shapeId, handleIndex, draggableData) {
        // should be arrowheadId not shapeID

        this.props.onHandleDragStart(shapeId, handleIndex, draggableData);
    }

    handleHandleDrag(shapeId, handleIndex, draggableData) {
        // should be arrowheadId not shapeID

        this.props.onHandleDrag(shapeId, handleIndex, draggableData);
    }

    handleHandleDragStop(shapeId, handleIndex, draggableData) {
        // should be arrowheadId not shapeID
        this.props.onHandleDragStop(shapeId, handleIndex, draggableData);
    }

    renderReferenceLine(path) {
        // update so it's not hardcoded!
        return <line x1={50} y1={75} x2={250} y2={75} strokeWidth={path.strokeWidth} stroke={path.stroke} strokeDasharray={path.strokeDasharray} />;
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
                    shapeId={arrowhead.id} // should be arrowheadid, right?
                    index={index}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    strokeWidth={2}
                    onDragStart={this.handleHandleDragStart}
                    onDrag={this.handleHandleDrag}
                    onDragStop={this.handleHandleDragStop}
                    propagateEvents={propagateEvents}
                />
            );
        });
    }

    // renderDrawing() {
    //     const { shapes } = this.props;
    //     return shapes.map((shape) => {
    //         return this.renderShape(shape);
    //     });
    // }

    render() {
        const { path, arrowhead } = this.props;

        return (
            <div style={{flex: 1, overflow: 'hidden'}}>
                <svg className="arrowhead-gui">
                    {this.renderReferenceLine(path)}
                    {this.renderArrowhead(arrowhead)}
                    {this.renderHandles(arrowhead)}
                </svg>
            </div>
        );
    }
}

export default ArrowheadGUI;
