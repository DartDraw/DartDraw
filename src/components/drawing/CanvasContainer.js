import { connect } from 'react-redux';
import Canvas from './Canvas';
import { ARROW_STROKE_WIDTH } from '../../constants';
import {
    canvasDragStart,
    canvasDrag,
    canvasDragStop,
    shapeClick,
    shapeDragStart,
    shapeDrag,
    shapeDragStop,
    groupDragStart,
    groupDrag,
    groupDragStop,
    groupClick,
    handleDragStart,
    handleDrag,
    handleDragStop,
    textInputChange,
    scroll,
    updateBoundingBoxes
} from './../../actions/canvas';
import { setRulerGrid, mouseMove } from './../../actions/menu';

function formatShape(shape, shapes, scale) {
    const formattedShape = Object.assign({}, shape);
    if (formattedShape.type === 'group') {
        formattedShape.members = formattedShape.members.map((shapeId, i) => {
            return formatShape(shapes.byId[shapeId], shapes, scale);
        });
    } else {
        if (formattedShape.type === 'line') {
            formattedShape.arrowHeadLength = formattedShape.arrowHeadLength * formattedShape.strokeWidth / ARROW_STROKE_WIDTH;
        }

        formattedShape.strokeWidth = formattedShape.strokeWidth * scale;
    }

    return formattedShape;
}

function formatArrow(arrow, shapes, scale) {
    const line = shapes.byId[arrow.lineId];
    const strokeProps = {
        stroke: line.stroke,
        strokeWidth: line.strokeWidth * scale,
        strokeDasharray: line.strokeDasharray
    };
    return Object.assign({}, arrow, strokeProps);
}

const mapStateToProps = ({ drawingState, menuState }) => {
    const { shapes, arrows, selected, canvasHeight, canvasWidth, panX, panY, scale } = drawingState;
    const { toolType } = menuState;
    const shapesArray = shapes.allIds.map((id) => {
        return formatShape(shapes.byId[id], shapes, scale);
    });

    const arrowsArray = arrows.allIds.map((id) => {
        return formatArrow(arrows.byId[id], shapes, scale);
    });

    const propagateEventTools = [
        'rectangleTool',
        'roundedRectangleTool',
        'ellipseTool',
        'polygonTool',
        'bezierTool',
        'arcTool',
        'freehandPathTool',
        'lineTool',
        'textTool',
        'panTool',
        'zoomTool'
    ];

    return {
        shapes: shapesArray,
        arrows: arrowsArray,
        selected,
        canvasHeight: canvasHeight * scale,
        canvasWidth: canvasWidth * scale,
        viewBox: [panX, panY, canvasWidth, canvasHeight],
        scale,
        propagateEvents: propagateEventTools.indexOf(toolType) > -1
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDragStart: (draggableData) => {
            dispatch(canvasDragStart(draggableData));
        },
        onDrag: (draggableData) => {
            dispatch(canvasDrag(draggableData));
        },
        onDragStop: (draggableData) => {
            dispatch(canvasDragStop(draggableData));
        },
        onShapeDragStart: (shapeId, draggableData) => {
            dispatch(shapeDragStart(shapeId, draggableData));
        },
        onShapeDrag: (shapeId, draggableData) => {
            dispatch(shapeDrag(shapeId, draggableData));
        },
        onShapeDragStop: (shapeId, draggableData) => {
            dispatch(shapeDragStop(shapeId));
        },
        onShapeClick: (shapeId, event) => {
            dispatch(shapeClick(shapeId));
        },
        onGroupDragStart: (groupId, draggableData) => {
            dispatch(groupDragStart(groupId, draggableData));
        },
        onGroupDrag: (groupId, draggableData) => {
            dispatch(groupDrag(groupId, draggableData));
        },
        onGroupDragStop: (groupId, draggableData) => {
            dispatch(groupDragStop(groupId, draggableData));
        },
        onGroupClick: (groupId, event) => {
            dispatch(groupClick(groupId, event));
        },
        onHandleDragStart: (shapeId, handleIndex, draggableData) => {
            dispatch(handleDragStart(shapeId, handleIndex, draggableData));
        },
        onHandleDrag: (shapeId, handleIndex, draggableData) => {
            dispatch(handleDrag(shapeId, handleIndex, draggableData));
        },
        onHandleDragStop: (shapeId, handleIndex, draggableData) => {
            dispatch(handleDragStop(shapeId, handleIndex, draggableData));
        },
        onTextInputChange: (textId, value, focused, selectionRange) => {
            dispatch(textInputChange(textId, value, focused, selectionRange));
        },
        onScroll: (deltaX, deltaY) => {
            dispatch(scroll(deltaX, deltaY));
        },
        onBoundingBoxUpdate: (boundingBoxes) => {
            dispatch(updateBoundingBoxes(boundingBoxes));
        },
        onSetRulerGrid: () => {
            dispatch(setRulerGrid());
        },
        onMouseMove: (coord) => {
            dispatch(mouseMove(coord));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Canvas);
