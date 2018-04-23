import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Canvas.css';
import { Draggable } from '../shared';
import {
    BackgroundLayerContainer,
    GridLayerContainer,
    SelectionLayerContainer,
    TextInputLayerContainer
} from './layers';
import {
    Group,
    Rectangle,
    Ellipse,
    Polygon,
    Polyline,
    FreehandPath,
    Path,
    Arc,
    Line,
    TransparentLine,
    Text,
    Arrow,
    Bezier
} from './shapes';

class Canvas extends Component {
    static propTypes = {
        shapes: PropTypes.array,
        arrows: PropTypes.array,
        selected: PropTypes.array,
        canvasHeight: PropTypes.number,
        canvasWidth: PropTypes.number,
        viewBox: PropTypes.array,
        scale: PropTypes.number,
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
        onUndoClick: PropTypes.func,
        onRedoClick: PropTypes.func,
        onScroll: PropTypes.func,
        onBoundingBoxUpdate: PropTypes.func,
        onSetRulerGrid: PropTypes.func,
        onMouseMove: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.renderDrawing = this.renderDrawing.bind(this);
        this.renderArrows = this.renderArrows.bind(this);
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
        this.handleScroll = this.handleScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    componentDidUpdate(prevProps) {
        const { onBoundingBoxUpdate, shapes, selected } = this.props;
        const selectedHasChanged = JSON.stringify(selected) !== JSON.stringify(prevProps.selected);
        const shapesHaveChanged = JSON.stringify(shapes) !== JSON.stringify(prevProps.shapes);
        if (shapesHaveChanged || selectedHasChanged) {
            const boundingBoxes = {};
            const svgElements = [...(this.svgRef.childNodes)];
            svgElements.map((element) => {
                if (element.className.baseVal === 'line') {
                    element = element.childNodes[0];
                }
                if (element.id && element.tagName !== 'marker') {
                    if (element.tagName === 'foreignObject') {
                        boundingBoxes[element.id] = Object.assign({}, element.getBBox(), { x: element.getAttribute('x'), y: element.getAttribute('y') });
                    }
                    boundingBoxes[element.id] = element.getBBox({ markers: true }); // https://bugs.chromium.org/p/chromium/issues/detail?id=280576
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

    handleUndoClick() {
        this.props.onUndoClick();
    }

    handleRedoClick() {
        this.props.onRedoClick();
    }

    handleScroll({ deltaX, deltaY }) {
        this.props.onScroll(deltaX, deltaY);
    }

    handleResize() {
        this.props.onSetRulerGrid();
    }

    handleMouseMove(e) {
        console.log(e.clientX, e.clientY);
        this.props.onMouseMove({x: e.clientX, y: e.clientY});
    }

    renderShape(shape) {
        const { propagateEvents } = this.props;
        const shapeProps = {
            ...shape,
            key: shape.id,
            onDragStart: this.handleShapeDragStart,
            onDrag: this.handleShapeDrag,
            onDragStop: this.handleShapeDragStop,
            onClick: this.handleShapeClick,
            propagateEvents: propagateEvents
        };

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
                return <Rectangle {...shapeProps} />;
            case 'ellipse':
                return <Ellipse {...shapeProps} />;
            case 'polygon':
                return <Polygon {...shapeProps} />;
            case 'polyline':
                return <Polyline {...shapeProps} />;
            case 'bezier':
                return <Bezier {...shapeProps} />;
            case 'arc':
                return <Arc {...shapeProps} />;
            case 'path':
                return <Path {...shapeProps} />;
            case 'freehandPath':
                return <FreehandPath {...shapeProps} />;
            case 'line':
                let line = {
                    points: shapeProps.points,
                    id: shapeProps.id,
                    key: shapeProps.id + "_transparent"
                };

                return (
                    <g key={line.id} className="line">
                        <Line {...shapeProps} />
                        <TransparentLine {...line} />
                    </g>);
            case 'text':
                return <Text {...shapeProps} />;
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

    renderArrows() {
        const { arrows, scale } = this.props;
        return arrows.map((arrow) => {
            return <Arrow key={arrow.id} scale={scale} {...arrow} />;
        });
    }

    render() {
        const { canvasHeight, canvasWidth, viewBox, propagateEvents } = this.props;

        return (
            <div style={{flex: 1, overflow: 'hidden'}} onWheel={this.handleScroll}>
                <TextInputLayerContainer propagateEvents={propagateEvents} />
                <Draggable
                    onStart={this.handleDragStart}
                    onDrag={this.handleDrag}
                    onStop={this.handleDragStop}
                >
                    <svg className="Canvas"
                        onMouseMove={this.handleMouseMove}
                        width={canvasWidth}
                        height={canvasHeight}
                        viewBox={viewBox.join(' ')}
                        ref={(ref) => { this.svgRef = ref; }}
                    >
                        <BackgroundLayerContainer />
                        {this.renderDrawing()}
                        {this.renderArrows()}
                        <GridLayerContainer />
                        <SelectionLayerContainer />
                    </svg>
                </Draggable>
            </div>
        );
    }
}

export default Canvas;
