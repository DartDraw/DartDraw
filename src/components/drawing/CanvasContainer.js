import { connect } from 'react-redux';
import Canvas from './Canvas';
import {
    undoClick,
    redoClick,
    canvasDragStart,
    canvasDrag,
    canvasDragStop,
    shapeDrag,
    shapeDragStop
} from './../../actions/actions';

const mapStateToProps = (state) => {
    const shapes = state.drawingState.zIndexedShapeIds.map(function(id) {
        return state.drawingState.drawing[id];
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
        onDragStop: () => {
            dispatch(canvasDragStop());
        },
        onShapeDrag: (shapeId, draggableData) => {
            dispatch(shapeDrag(shapeId, draggableData));
        },
        onShapeDragStop: (shapeId) => {
            dispatch(shapeDragStop(shapeId));
        },
        onUndoClick: () => {
            dispatch(undoClick());
        },
        onRedoClick: () => {
            dispatch(redoClick());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Canvas);
