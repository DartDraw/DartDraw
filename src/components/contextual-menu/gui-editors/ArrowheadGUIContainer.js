import { connect } from 'react-redux';
import ArrowheadGUI from './ArrowheadGUI';
import {
    arrowheadHandleDragStart,
    arrowheadHandleDrag,
    arrowheadHandleDragStop,
    changeArrowheadType
} from '../../../actions/menu';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { arrowheadPresets, currentArrowhead } = menuState;

    return {
        arrowheadPresets,
        currentArrowhead
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onArrowheadHandleDragStart: (shapeId, handleIndex, draggableData) => {
            dispatch(arrowheadHandleDragStart(shapeId, handleIndex, draggableData));
        },
        onArrowheadHandleDrag: (shapeId, handleIndex, draggableData) => {
            dispatch(arrowheadHandleDrag(shapeId, handleIndex, draggableData));
        },
        onArrowheadHandleDragStop: (shapeId, handleIndex, draggableData) => {
            dispatch(arrowheadHandleDragStop(shapeId, handleIndex, draggableData));
        },
        onChangeArrowheadType: (arrowheadType) => {
            dispatch(changeArrowheadType(arrowheadType));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArrowheadGUI);
