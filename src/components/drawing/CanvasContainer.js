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
        const selectionBox = selectionBoxes[id];
        const correspondingShape = drawing[id];
        const shapeZIndex = shapes.indexOf(correspondingShape);
        shapes.splice(shapeZIndex - 1, 0, selectionBox);
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
        onShapeDragStart: (shapeId, draggableData) => {
            dispatch(shapeDragStart(shapeId, draggableData));
        },
        onShapeDrag: (shapeId, draggableData) => {
            dispatch(shapeDrag(shapeId, draggableData));
        },
        onShapeDragStop: (shapeId, draggableData) => {
            dispatch(shapeDragStop(shapeId));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Canvas);
