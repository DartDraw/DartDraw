import { connect } from 'react-redux';
import ArrowheadGUI from './ArrowheadGUI';
import {
    arrowheadHandleDrag,
    changeArrowheadType,
    applyArrowhead,
    editArrowhead,
    changeArrowheadHeight,
    changeArrowheadLength,
    changeArrowheadBarbLength,
    changeArrowheadRadiusX,
    changeArrowheadRadiusY
} from '../../../actions/menu';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { arrowheadPresets, currentArrowhead } = menuState;
    const { arrowheads } = drawingState;

    return {
        arrowheads,
        arrowheadPresets,
        currentArrowhead
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onArrowheadHandleDrag: (shapeId, handleIndex, draggableData) => {
            dispatch(arrowheadHandleDrag(shapeId, handleIndex, draggableData));
        },
        onChangeArrowheadType: (arrowheadType) => {
            dispatch(changeArrowheadType(arrowheadType));
        },
        onApplyArrowhead: (arrowhead, path) => {
            dispatch(applyArrowhead(arrowhead, path));
        },
        onEditArrowhead: (arrowhead) => {
            dispatch(editArrowhead(arrowhead));
        },
        onHeightChange: (height) => {
            dispatch(changeArrowheadHeight(height));
        },
        onLengthChange: (length) => {
            dispatch(changeArrowheadLength(length));
        },
        onBarbLengthChange: (length) => {
            dispatch(changeArrowheadBarbLength(length));
        },
        onRadiusXChange: (rx) => {
            dispatch(changeArrowheadRadiusX(rx));
        },
        onRadiusYChange: (ry) => {
            dispatch(changeArrowheadRadiusY(ry));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArrowheadGUI);
