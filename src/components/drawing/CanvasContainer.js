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
        onDragStart: ({x, y, node}) => {
            dispatch(canvasDragStart({x, y, node}));
        },
        onDrag: ({x, y, deltaX, deltaY, node}) => {
            dispatch(canvasDrag({x, y, deltaX, deltaY, node}));
        },
        onDragStop: () => {
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
