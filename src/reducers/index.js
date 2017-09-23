import { combineReducers } from 'redux';
import drawingState from './drawingState';
import mouseEvent from './mouseEvent';

export default combineReducers({
    drawingState,
    mouseEvent
});
