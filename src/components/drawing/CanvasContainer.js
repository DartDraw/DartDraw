import { connect } from 'react-redux';
import Canvas from './Canvas';
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
    handleDragStop
} from './../../actions/canvas';

function formatShape(shape, shapes) {
    const formattedShape = Object.assign({}, shape);
    if (formattedShape.type === 'group') {
        formattedShape.members = formattedShape.members.map((shapeId, i) => {
            return formatShape(shapes.byId[shapeId], shapes);
        });
    }
    return formattedShape;
}

const mapStateToProps = ({ drawingState, menuState }) => {
    const { shapes, selectionBoxes } = drawingState;
    const { toolType } = menuState;
    const formattedShapes = shapes.allIds.map((id) => {
        return formatShape(shapes.byId[id], shapes);
    });
    Object.keys(selectionBoxes).map((id) => {
        formattedShapes.push(selectionBoxes[id]);
    });

    return {
        shapes: formattedShapes,
        canvasHeight: drawingState.canvasHeight,
        canvasWidth: drawingState.canvasWidth,
        canvasTransformationMatrix: drawingState.canvasTransformationMatrix,
        propagateEvents: toolType === 'rectangleTool' || toolType === 'lineTool' || toolType === 'panTool'
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
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Canvas);
