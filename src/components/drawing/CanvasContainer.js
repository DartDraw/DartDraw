import { connect } from 'react-redux';
import Canvas from './Canvas';
import {
    undoClick,
    redoClick,
    canvasDragStart,
    canvasDrag,
    canvasDragStop
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
        onCanvasDragStart: ({x, y}) => {
            dispatch(canvasDragStart({x, y}));
        },
        onCanvasDrag: ({mouseDownPositionX, mouseDownPositionY, moveDeltaX, moveDeltaY}) => {
            dispatch(canvasDrag({mouseDownPositionX, mouseDownPositionY, moveDeltaX, moveDeltaY}));
        },
        onCanvasDragStop: ({mouseDownPositionX, mouseDownPositionY, moveDeltaX, moveDeltaY}) => {
            dispatch(canvasDragStop());
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
