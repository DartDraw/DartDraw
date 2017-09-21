import { combineReducers } from 'redux';
import drawingState from './drawingState';
import tempDrawingState from './tempDrawingState';

export default combineReducers({
    drawingState,
    tempDrawingState
});
