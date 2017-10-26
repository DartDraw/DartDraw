import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Canvas.css';
import { Draggable } from '../shared';
import { Group, Rectangle, Path, Line, Handle } from '.';

class Canvas extends Component {
    static propTypes = {
        shapes: PropTypes.array,
        shapesWithoutSelectionBoxes: PropTypes.array,
        selected: PropTypes.array,
        canvasHeight: PropTypes.number,
        canvasWidth: PropTypes.number,
        canvasTransformationMatrix: PropTypes.array,
        propagateEvents: PropTypes.bool,
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        onShapeDragStart: PropTypes.func,
        onShapeDrag: PropTypes.func,
        onShapeDragStop: PropTypes.func,
        onShapeClick: PropTypes.func,
        onGroupDragStart: PropTypes.func,
        onGroupDrag: PropTypes.func,
        onGroupDragStop: PropTypes.func,
        onGroupClick: PropTypes.func,
        onHandleDragStart: PropTypes.func,
        onHandleDrag: PropTypes.func,
        onHandleDragStop: PropTypes.func,
        onUndoClick: PropTypes.func,
        onRedoClick: PropTypes.func,
        onBoundingBoxUpdate: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.renderDrawing = this.renderDrawing.bind(this);
        this.handleUndoClick = this.handleUndoClick.bind(this);
        this.handleRedoClick = this.handleRedoClick.bind(this);
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDragStop = this.handleDragStop.bind(this);
        this.handleShapeDragStart = this.handleShapeDragStart.bind(this);
        this.handleShapeDrag = this.handleShapeDrag.bind(this);
        this.handleShapeDragStop = this.handleShapeDragStop.bind(this);
        this.handleShapeClick = this.handleShapeClick.bind(this);
        this.handleGroupDragStart = this.handleGroupDragStart.bind(this);
        this.handleGroupDrag = this.handleGroupDrag.bind(this);
        this.handleGroupDragStop = this.handleGroupDragStop.bind(this);
        this.handleGroupClick = this.handleGroupClick.bind(this);
        this.handleHandleDragStart = this.handleHandleDragStart.bind(this);
        this.handleHandleDrag = this.handleHandleDrag.bind(this);
        this.handleHandleDragStop = this.handleHandleDragStop.bind(this);
    }

    componentDidUpdate(prevProps) {
        const { onBoundingBoxUpdate, shapesWithoutSelectionBoxes, selected } = this.props;
        const selectedHasChanged = JSON.stringify(selected) !== JSON.stringify(prevProps.selected);
        const shapesHaveChanged = JSON.stringify(shapesWithoutSelectionBoxes) !== JSON.stringify(prevProps.shapesWithoutSelectionBoxes);
        if (shapesHaveChanged || selectedHasChanged) {
            const boundingBoxes = {};
            const svgElements = [...(this.svgRef.childNodes[0].childNodes)];
            svgElements.map((element) => {
                if (element.id) {
                    boundingBoxes[element.id] = element.getBBox();
                }
            });
            onBoundingBoxUpdate && onBoundingBoxUpdate(boundingBoxes);
        }
    }

    handleDragStart(draggableData) {
        this.props.onDragStart(draggableData);
    }

    handleDrag(draggableData) {
        this.props.onDrag(draggableData);
    }

    handleDragStop(draggableData) {
        this.props.onDragStop(draggableData);
    }

    handleShapeDragStart(shapeId, draggableData) {
        this.props.onShapeDragStart(shapeId, draggableData);
    }

    handleShapeDrag(shapeId, draggableData) {
        this.props.onShapeDrag(shapeId, draggableData);
    }

    handleShapeDragStop(shapeId, draggableData) {
        this.props.onShapeDragStop(shapeId, draggableData);
    }

    handleShapeClick(shapeId, event) {
        this.props.onShapeClick(shapeId, event);
    }

    handleGroupDragStart(groupId, draggableData) {
        this.props.onGroupDragStart(groupId, draggableData);
    }

    handleGroupDrag(groupId, draggableData) {
        this.props.onGroupDrag(groupId, draggableData);
    }

    handleGroupDragStop(groupId, draggableData) {
        this.props.onGroupDragStop(groupId, draggableData);
    }

    handleGroupClick(groupId, event) {
        this.props.onGroupClick(groupId, event);
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

    handleUndoClick() {
        this.props.onUndoClick();
    }

    handleRedoClick() {
        this.props.onRedoClick();
    }

    renderHandles(shape) {
        const { propagateEvents, canvasTransformationMatrix } = this.props;
        const scale = canvasTransformationMatrix[0];
        return shape.handles.map((handle) => {
            const { id, index } = handle;
            let x = handle.x - ((Math.sqrt(2) * 10 / 2) / scale);
            let y = handle.y - ((Math.sqrt(2) * 10 / 2) / scale);
            return (
                <Handle
                    key={id}
                    id={id}
                    shapeId={shape.shapeId}
                    index={index}
                    x={x}
                    y={y}
                    width={10 / scale}
                    height={10 / scale}
                    strokeWidth={2 / scale}
                    onDragStart={this.handleHandleDragStart}
                    onDrag={this.handleHandleDrag}
                    onDragStop={this.handleHandleDragStop}
                    propagateEvents={propagateEvents}
                    transform={shape.transform}
                />
            );
        });
    }

    renderShape(shape) {
        const { propagateEvents, canvasTransformationMatrix } = this.props;
        const scale = canvasTransformationMatrix[0];
        switch (shape.type) {
            case 'group':
                const groupMembers = shape.members.map((shape) => {
                    return this.renderShape(shape);
                });
                return (
                    <Group
                        key={shape.id}
                        id={shape.id}
                        transform={shape.transform}
                        onDragStart={this.handleGroupDragStart}
                        onDrag={this.handleGroupDrag}
                        onDragStop={this.handleGroupDragStop}
                        onClick={this.handleGroupClick}
                    >
                        {groupMembers}
                    </Group>
                );
            case 'rectangle':
                return (
                    <Rectangle
                        key={shape.id}
                        {...shape}
                        onDragStart={this.handleShapeDragStart}
                        onDrag={this.handleShapeDrag}
                        onDragStop={this.handleShapeDragStop}
                        onClick={this.handleShapeClick}
                        propagateEvents={propagateEvents}
                    />
                );
            case 'path':
                return (
                    <Path
                        key={shape.id}
                        {...shape}
                        onDragStart={this.handleShapeDragStart}
                        onDrag={this.handleShapeDrag}
                        onDragStop={this.handleShapeDragStop}
                        onClick={this.handleShapeClick}
                        propagateEvents={propagateEvents}
                    />
                );
            case 'line':
                return (
                    <Line
                        key={shape.id}
                        {...shape}
                        onDragStart={this.handleShapeDragStart}
                        onDrag={this.handleShapeDrag}
                        onDragStop={this.handleShapeDragStop}
                        onClick={this.handleShapeClick}
                        propagateEvents={propagateEvents}
                    />
                );
            case 'selectionBox':
                return (
                    <g key={shape.id}>
                        <Rectangle
                            x={shape.x}
                            y={shape.y}
                            width={shape.width}
                            height={shape.height}
                            transform={shape.transform}
                            stroke='rgba(102, 204, 255, 0.7)'
                            strokeWidth={4 / scale}
                            fill='none'
                            propagateEvents={propagateEvents}
                        />
                        {this.renderHandles(shape)}
                    </g>
                );
            default:
                break;
        }
    }

    renderDrawing() {
        const { shapes } = this.props;
        return shapes.map((shape) => {
            return this.renderShape(shape);
        });
    }

    render() {
        const { canvasTransformationMatrix, canvasHeight, canvasWidth } = this.props;
        return (
            <div>
                <Draggable
                    onStart={this.handleDragStart}
                    onDrag={this.handleDrag}
                    onStop={this.handleDragStop}
                >
                    <svg className="Canvas" height={canvasHeight} width={canvasWidth} ref={(ref) => { this.svgRef = ref; }}>
                        <g transform={`matrix(${canvasTransformationMatrix.join(' ')})`}>
                            {this.renderDrawing()}
                        </g>
                    </svg>
                </Draggable>
            </div>
        );
    }
}

export default Canvas;
