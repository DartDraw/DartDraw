import { connect } from 'react-redux';
import ArrowheadGUI from './ArrowheadGUI';
import {
    handleDragStart,
    handleDrag,
    handleDragStop
} from '../../../actions/canvas';

function formatShape(shape, shapes, scale) {
    const formattedShape = Object.assign({}, shape);
    if (formattedShape.type === 'group') {
        formattedShape.members = formattedShape.members.map((shapeId, i) => {
            return formatShape(shapes.byId[shapeId], shapes, scale);
        });
    } else {
        formattedShape.strokeWidth = formattedShape.strokeWidth * scale;
    }
    return formattedShape;
}

const mapStateToProps = ({ drawingState, menuState }) => {
    const { shapes, selected, scale } = drawingState;
    const { toolType } = menuState;
    const shapesArray = shapes.allIds.map((id) => {
        return formatShape(shapes.byId[id], shapes, scale);
    });

    const arrowsArray = shapes.allArrows.map((id) => {
        return formatShape(shapes.byId[shapes.byArrowId[id].id], shapes, scale);
    });

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

    return {
        shapes: shapesArray,
        arrows: arrowsArray,
        selected,
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
)(ArrowheadGUI);
