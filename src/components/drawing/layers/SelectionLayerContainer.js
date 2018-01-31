import { connect } from 'react-redux';
import SelectionLayer from './SelectionLayer';
import { handleDragStart, handleDrag, handleDragStop } from '../../../actions/canvas';

const propagateEventTools = [
    'rectangleTool',
    'ellipseTool',
    'polygonTool',
    'bezierTool',
    'arcTool',
    'freehandPathTool',
    'lineTool',
    'textTool',
    'panTool',
    'zoomTool'
];

const mapStateToProps = ({ drawingState, menuState }) => {
    const { selectionBoxes } = drawingState;
    const { toolType } = menuState;
    const selectionBoxesArray = Object.keys(selectionBoxes).map((id) => {
        return selectionBoxes[id];
    });

    return {
        selectionBoxes: selectionBoxesArray,
        marqueeBox: drawingState.marqueeBox,
        scale: drawingState.scale,
        propagateEvents: propagateEventTools.indexOf(toolType) > -1
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onHandleDragStart: (shapeId, handleIndex, draggableData) => {
            dispatch(handleDragStart(shapeId, handleIndex, draggableData));
        },
        onHandleDrag: (shapeId, handleIndex, draggableData) => {
            dispatch(handleDrag(shapeId, handleIndex, draggableData));
        },
        onHandleDragStop: (shapeId, handleIndex, draggableData) => {
            dispatch(handleDragStop(shapeId, handleIndex, draggableData));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectionLayer);
