import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Rectangle, Handle, Control, Line } from '../shapes';

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
        onControlDragStop: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleHandleDragStart = this.handleHandleDragStart.bind(this);
        this.handleHandleDrag = this.handleHandleDrag.bind(this);
        this.handleHandleDragStop = this.handleHandleDragStop.bind(this);
        this.handleControlDragStart = this.handleControlDragStart.bind(this);
        this.handleControlDrag = this.handleControlDrag.bind(this);
        this.handleControlDragStop = this.handleControlDragStop.bind(this);
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

    renderHandles(selectionBox) {
        const { propagateEvents, scale } = this.props;
        console.log("handles:", selectionBox);
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

    renderControls(selectionBox) {
        const { propagateEvents, scale } = this.props;
        console.log("controls:", selectionBox);
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
                    arrowLength={0}
                    strokeWidth={2}
                    stroke={"black"}
                    propagateEvents={propagateEvents}
                />
            );
        });
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
                    {this.renderControlLines(selectionBox)}
                    {this.renderHandles(selectionBox)}
                    {this.renderControls(selectionBox)}

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
