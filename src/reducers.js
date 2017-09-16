import { ADD_SHAPE } from './actions';

const initialState = {
    drawing: {},
    drawingArray: [],
    nextShapeId: 0
};

function DartDraw(state = initialState, action) {
    switch (action.type) {
        case ADD_SHAPE: {
            // Create a copy of the drawing and then add the new shape:
            const updatedDrawing = Object.assign({}, state.drawing);
            action.shape.id = state.nextShapeId;
            updatedDrawing[state.nextShapeId] = action.shape;
            // Create a copy of the z-index ordered array and then add the new shape:
            const updatedDrawingArray = state.drawingArray.slice();
            updatedDrawingArray.push(action.shape);

            // Return an updated copy of the redux state:
            return Object.assign(
                {},
                state,
                {
                    drawing: updatedDrawing,
                    drawingArray: updatedDrawingArray,
                    nextShapeId: state.nextShapeId + 1
                }
            );
        }
        default: {
            return state;
        }
    }
}

export default DartDraw;
