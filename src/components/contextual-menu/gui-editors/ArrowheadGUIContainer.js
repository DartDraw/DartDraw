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
// import { setArrowheadType } from '../../../reducers/utilities/arrowhead';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { arrowheadPresets, currentArrowhead } = menuState;
    // const { shapes } = drawingState;
    //
    // var currentArrowhead = shapes.allArrows[0];
    //
    // console.log(shapes.allArrows[0]);
    //
    // if (!currentArrowhead) {
    //     currentArrowhead = setArrowheadType('triangle');
    // }

    return {
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
