import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Rectangle, Handle, Control, Line, TransparentLine, TransparentBezier } from '../shapes';

class SelectionLayer extends Component {
    static propTypes = {
        selectionBoxes: PropTypes.array,
        marqueeBox: PropTypes.object,
        scale: PropTypes.number,
        propagateEvents: PropTypes.bool,
        onHandleDragStart: PropTypes.func,
        onHandleDrag: PropTypes.func,
        onHandleDragStop: PropTypes.func,
        onControlDragStart: PropTypes.func,
        onControlDrag: PropTypes.func,
        onControlDragStop: PropTypes.func,
        onAddPointDragStop: PropTypes.func,
        onTextHandleDragStart: PropTypes.func,
        onTextHandleDrag: PropTypes.func,
        onTextHandleDragStop: PropTypes.func,
        onTextHandleClick: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleHandleDragStart = this.handleHandleDragStart.bind(this);
        this.handleHandleDrag = this.handleHandleDrag.bind(this);
        this.handleHandleDragStop = this.handleHandleDragStop.bind(this);
        this.handleControlDragStart = this.handleControlDragStart.bind(this);
        this.handleControlDrag = this.handleControlDrag.bind(this);
        this.handleControlDragStop = this.handleControlDragStop.bind(this);
        this.handleAddPointDragStop = this.handleAddPointDragStop.bind(this);
        this.handleTextHandleDragStart = this.handleTextHandleDragStart.bind(this);
        this.handleTextHandleDrag = this.handleTextHandleDrag.bind(this);
        this.handleTextHandleDragStop = this.handleTextHandleDragStop.bind(this);
        this.handleTextHandleClick = this.handleTextHandleClick.bind(this);
    }

    handleHandleDragStart(shapeId, handleIndex, draggableData) {
        this.props.onHandleDragStart(shapeId, handleIndex, draggableData);
    }

    handleHandleDrag(shapeId, handleIndex, draggableData) {
        this.props.onHandleDrag(shapeId, handleIndex, draggableData);
    }

    handleHandleDragStop(shapeId, handleIndex, draggableData) {
        this.props.onHandleDragStop(shapeId, handleIndex, draggableData);
    }

    handleControlDragStart(shapeId, handleIndex, draggableData) {
        this.props.onControlDragStart(shapeId, handleIndex, draggableData);
    }

    handleControlDrag(shapeId, handleIndex, draggableData) {
        this.props.onControlDrag(shapeId, handleIndex, draggableData);
    }

    handleControlDragStop(shapeId, handleIndex, draggableData) {
        this.props.onControlDragStop(shapeId, handleIndex, draggableData);
    }

    handleAddPointDragStop(shapeId, handleIndex, draggableData) {
        this.props.onAddPointDragStop(shapeId, handleIndex, draggableData);
    }

    handleTextHandleDragStart(shapeId, draggableData) {
        this.props.onTextHandleDragStart(shapeId, draggableData);
    }

    handleTextHandleDrag(shapeId, draggableData) {
        this.props.onTextHandleDrag(shapeId, draggableData);
    }

    handleTextHandleDragStop(shapeId, draggableData) {
        this.props.onTextHandleDragStop(shapeId, draggableData);
    }

    handleTextHandleClick(shapeId, event) {
        this.props.onTextHandleClick(shapeId, event);
    }

    renderHandles(selectionBox) {
        const { propagateEvents, scale } = this.props;
        return selectionBox.handles.map((handle, i) => {
            const { id, index } = handle;
            const x = handle.x - 5 / scale;
            const y = handle.y - 5 / scale;
            let width = 10 / scale;
            let height = 10 / scale;

            if (selectionBox.shapeType === 'line' && selectionBox.handles.length > 4) {
                if (i < 4) {
                    width = 0;
                    height = 0;
                }
            }

            return (
                <Handle
                    key={id}
                    id={id}
                    shapeId={selectionBox.shapeId}
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

    renderAddPointLines(selectionBox) {
        if (!selectionBox.controls) return;

        return selectionBox.addPointLines.map((line, i) => {
            const { id, index } = line;

            return (
                <TransparentLine
                    key={id}
                    id={id}
                    shapeId={selectionBox.shapeId}
                    index={index}
                    points={line.points}
                    arrowheadLength={0}
                    strokeWidth={line.stroke}
                    stroke={"transparent"}
                    pointerEvents={"stroke"}
                    onDragStop={this.handleAddPointDragStop}
                    onDragStart={() => console.log("start")}
                />
            );
        });
    }

    renderAddPointBeziers(selectionBox) {
        if (!selectionBox.controls) return;

        return selectionBox.addPointBeziers.map((line, i) => {
            const { id, index } = line;

            return (
                <TransparentBezier
                    key={id}
                    id={id}
                    shapeId={selectionBox.shapeId}
                    index={index}
                    points={line.points}
                    controlPoints={line.controlPoints}
                    arrowheadLength={0}
                    strokeWidth={line.stroke}
                    stroke={"transparent"}
                    fill={"none"}
                    pointerEvents={"stroke"}
                    onDragStop={this.handleAddPointDragStop}
                />
            );
        });
    }

    renderControls(selectionBox) {
        const { propagateEvents, scale } = this.props;
        if (!selectionBox.controls) return;
        return selectionBox.controls.map((control, i) => {
            const { id, index } = control;
            const x2 = control.x2 / scale;
            const y2 = control.y2 / scale;
            let width = 10 / scale;
            let height = 10 / scale;

            return (
                <Control
                    key={id}
                    id={id}
                    shapeId={selectionBox.shapeId}
                    index={index}
                    x={x2}
                    y={y2}
                    width={width}
                    height={height}
                    strokeWidth={2}
                    onDragStart={this.handleControlDragStart}
                    onDrag={this.handleControlDrag}
                    onDragStop={this.handleControlDragStop}
                    propagateEvents={propagateEvents}
                />
            );
        });
    }

    renderControlLines(selectionBox) {
        const { propagateEvents } = this.props;
        if (!selectionBox.controls) return;

        return selectionBox.controls.map((control, i) => {
            const { id, index } = control;

            return (
                <Line
                    key={id}
                    id={id}
                    shapeId={selectionBox.shapeId}
                    index={index}
                    points={[control.x1, control.y1, control.x2, control.y2]}
                    arrowheadLength={0}
                    strokeWidth={2}
                    stroke={"black"}
                    propagateEvents={propagateEvents}
                />
            );
        });
    }

    renderTextHandle(selectionBox) {
        const { propagateEvents, scale } = this.props;

        if (selectionBox.shapeType === 'text') {
            return (
                <Rectangle
                    id={selectionBox.shapeId}
                    x={selectionBox.x + selectionBox.width / 2 - 7 / scale}
                    y={selectionBox.y - 15 / scale}
                    width={14 / scale}
                    height={14 / scale}
                    transform={selectionBox.transform}
                    onDragStart={this.handleTextHandleDragStart}
                    onDrag={this.handleTextHandleDrag}
                    onDragStop={this.handleTextHandleDragStop}
                    onClick={this.handleTextHandleClick}
                    propagateEvents={propagateEvents}
                />
            );
        } else {
            return null;
        }
    }

    renderSelectionBoxes() {
        const { selectionBoxes, propagateEvents } = this.props;
        return selectionBoxes.map(selectionBox => {
            return (
                <g key={selectionBox.id}>
                    <Rectangle
                        x={selectionBox.x}
                        y={selectionBox.y}
                        width={selectionBox.width}
                        height={selectionBox.height}
                        transform={selectionBox.transform}
                        stroke='rgba(102, 204, 255, 0.7)'
                        vectorEffect="non-scaling-stroke"
                        strokeWidth={4}
                        fill='none'
                        propagateEvents={propagateEvents}
                    />
                    {this.renderAddPointLines(selectionBox)}
                    {this.renderAddPointBeziers(selectionBox)}
                    {this.renderControlLines(selectionBox)}
                    {this.renderHandles(selectionBox)}
                    {this.renderControls(selectionBox)}
                    {this.renderTextHandle(selectionBox)}
                </g>
            );
        });
    }

    renderMarqueeBox() {
        const { propagateEvents, marqueeBox } = this.props;

        if (marqueeBox != null) {
            return (
                <g key={marqueeBox.id}>
                    <Rectangle
                        {...marqueeBox}
                        propagateEvents={propagateEvents}
                    />
                </g>
            );
        }
    }

    render() {
        return (
            <g>
                {this.renderSelectionBoxes()}
                {this.renderMarqueeBox()}
            </g>
        );
    }
}

export default SelectionLayer;
