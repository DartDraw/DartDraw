import { connect } from 'react-redux';
import Canvas from './Canvas';
import {
    undo,
    redo,
    addShape
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
        onCanvasClick: (shape) => {
            dispatch(addShape(shape));
        },
        onUndoClick: () => {
            dispatch(undo());
        },
        onRedoClick: () => {
            dispatch(redo());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Canvas);
