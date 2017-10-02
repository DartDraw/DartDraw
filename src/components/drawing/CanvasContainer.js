import { connect } from 'react-redux';
import Canvas from './Canvas';
import {
    canvasDragStart,
    canvasDrag,
    canvasDragStop,
    shapeDragStart,
    shapeDrag,
    shapeDragStop
} from './../../actions/canvas';

const mapStateToProps = ({drawingState}) => {
    const { drawing, zIndexedShapeIds, selectionBoxes } = drawingState;
    const shapes = zIndexedShapeIds.map((id) => {
        return drawing[id];
    });
    Object.keys(selectionBoxes).map((id) => {
        shapes.push(selectionBoxes[id]);
    });

    return {
        drawing,
        shapes
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
        onGroupDragStart: (groupId, draggableData) => {
        },
        onGroupDrag: (groupId, draggableData) => {
        },
        onGroupDragStop: (groupId, draggableData) => {
        },
        onResizeHandleDragStart: (shapeId, draggableData) => {
            console.log(shapeId, draggableData);
            console.log("start handle drag");
        },
        onResizeHandleDrag: (shapeId, draggableData) => {
            console.log(shapeId, draggableData);
            console.log("handle drag");
        },
        onResizeHandleDragStop: (shapeId, draggableData) => {
            console.log(shapeId, draggableData);
            console.log("stop handle drag");
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Canvas);
