import * as actions from './../actions/actions';

const initialState = {
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0
};

function MouseEvent(state = initialState, action) {
    switch (action.type) {
        case actions.ADD_SHAPE:
            return state;
        default:
            return state;
    }
}

export default MouseEvent;
