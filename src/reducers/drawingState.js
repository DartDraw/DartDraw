import * as actions from './../actions/actions';
import * as shape from './functions/shape';
import * as selection from './functions/selection';
import * as undoredo from './functions/undoredo';

const initialState = {
    selected: [],
    editing: {},
    drawing: {},
    zIndexedShapeIds: [],
    past: [],
    future: []
};

function DartDraw(state = initialState, action) {
    switch (action.type) {
        case actions.CANVAS_DRAG_START:
            return shape.addShape(state, action);
        case actions.CANVAS_DRAG:
            return shape.resizeShape(state, action);
        case actions.CANVAS_DRAG_STOP:
            return shape.dragRelease(state);
        case actions.SHAPE_DRAG:
            return shape.moveShape(state, action);
        case actions.SHAPE_DRAG_STOP:
            return shape.saveShapeMove(state, action);
        case actions.UNDO_CLICK:
            return undoredo.undo(state);
        case actions.REDO_CLICK:
            return undoredo.redo(state);
        case actions.SELECT:
            return selection.select(state, action);
        default:
            return state;
    }
}

export default DartDraw;
