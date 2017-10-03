import { connect } from 'react-redux';
import Canvas from './Canvas';
import {
    canvasDragStart,
    canvasDrag,
    canvasDragStop,
    shapeDragStart,
    shapeDrag,
    shapeDragStop,
    handleDragStart,
    handleDrag,
    handleDragStop
} from './../../actions/canvas';

const mapStateToProps = ({ drawingState }) => {
    const { selectionBoxes } = drawingState;
    const shapes = drawingState.shapes.allIds.map((id) => {
        return drawingState.shapes.byId[id];
    });
    Object.keys(selectionBoxes).map((id) => {
        shapes.push(selectionBoxes[id]);
    });

    return {
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
        onHandleDragStart: (shapeId, handleIndex, draggableData) => {
            console.log(shapeId, handleIndex, draggableData);
            console.log("start handle drag");
            dispatch(handleDragStart(shapeId, handleIndex, draggableData));
        },
        onHandleDrag: (shapeId, handleIndex, draggableData) => {
            console.log(shapeId, handleIndex, draggableData);
            console.log("handle drag");
            dispatch(handleDrag(shapeId, handleIndex, draggableData));
        },
        onHandleDragStop: (shapeId, handleIndex, draggableData) => {
            console.log(shapeId, handleIndex, draggableData);
            console.log("stop handle drag");
            dispatch(handleDragStop(shapeId, handleIndex, draggableData));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Canvas);
