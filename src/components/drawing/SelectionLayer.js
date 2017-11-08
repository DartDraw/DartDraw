import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Rectangle, Handle } from '.';

class SelectionLayer extends Component {
    static propTypes = {
        selectionBoxes: PropTypes.array,
        marqueeBox: PropTypes.object,
        scale: PropTypes.number,
        propagateEvents: PropTypes.bool,
        onHandleDragStart: PropTypes.func,
        onHandleDrag: PropTypes.func,
        onHandleDragStop: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleHandleDragStart = this.handleHandleDragStart.bind(this);
        this.handleHandleDrag = this.handleHandleDrag.bind(this);
        this.handleHandleDragStop = this.handleHandleDragStop.bind(this);
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

    renderHandles(selectionBox) {
        const { propagateEvents, scale } = this.props;
        return selectionBox.handles.map((handle) => {
            const { id, index } = handle;
            const x = handle.x - 5 / scale;
            const y = handle.y - 5 / scale;
            return (
                <Handle
                    key={id}
                    id={id}
                    shapeId={selectionBox.shapeId}
                    index={index}
                    x={x}
                    y={y}
                    width={10 / scale}
                    height={10 / scale}
                    strokeWidth={2}
                    onDragStart={this.handleHandleDragStart}
                    onDrag={this.handleHandleDrag}
                    onDragStop={this.handleHandleDragStop}
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
                    {this.renderHandles(selectionBox)}
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
                        x={marqueeBox.x}
                        y={marqueeBox.y}
                        width={marqueeBox.width}
                        height={marqueeBox.height}
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
