import { connect } from 'react-redux';
import TextInputLayer from './TextInputLayer';
import {
    shapeClick,
    shapeDragStart,
    shapeDrag,
    shapeDragStop,
    textInputChange
} from '../../../actions/canvas';

const mapStateToProps = ({ drawingState }) => {
    const { shapes, selected, canvasHeight, canvasWidth, scale } = drawingState;
    const shapesArray = shapes.allIds.filter(id => {
        return shapes.byId[id].type === 'text';
    }).map(id => {
        shapes.byId[id].selected = selected.indexOf(id) > -1;
        return shapes.byId[id];
    });

    return {
        textObjects: shapesArray,
        canvasHeight: canvasHeight * scale,
        canvasWidth: canvasWidth * scale
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onShapeDragStart: (shapeId, draggableData) => {
            dispatch(shapeDragStart(shapeId, draggableData));
        },
        onShapeDrag: (shapeId, draggableData) => {
            dispatch(shapeDrag(shapeId, draggableData));
        },
        onShapeDragStop: (shapeId, draggableData) => {
            dispatch(shapeDragStop(shapeId));
        },
        onShapeClick: (shapeId, event) => {
            dispatch(shapeClick(shapeId));
        },
        onTextInputChange: (textId, value, focused) => {
            dispatch(textInputChange(textId, value, focused));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TextInputLayer);
