import drawingState from './drawingState';
import menuState from './menuState';

export default (state = {}, action) => {
    return {
        drawingState: drawingState(state.drawingState, action, state),
        menuState: menuState(state.menuState, action, state)
    };
};
