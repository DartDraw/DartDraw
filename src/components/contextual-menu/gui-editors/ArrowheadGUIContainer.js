import { connect } from 'react-redux';
import ArrowheadGUI from './ArrowheadGUI';
import {
    arrowheadHandleDrag,
    changeArrowheadType,
    toggleArrowheadFill,
    changeArrowheadHeight,
    changeArrowheadLength,
    changeArrowheadBarbLength,
    changeArrowheadRadiusX,
    changeArrowheadRadiusY,
    selectArrowheadPreset,
    addArrowheadPreset,
    saveArrowheadPreset,
    deleteArrowheadPreset
} from '../../../actions/menu';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { shapes, arrowheads, selected } = drawingState;

    const selectedArrowhead = arrowheads.byId[shapes.byId[selected[0]].arrowheadId];

    return {
        arrowheads,
        selectedArrowhead,
        presetNames: Object.keys(arrowheads.presets)
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
        onToggleArrowheadFill: () => {
            dispatch(toggleArrowheadFill());
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
        },
        onSelectArrowheadPreset: (name) => {
            dispatch(selectArrowheadPreset(name));
        },
        onAddArrowheadPreset: (name, arrowhead) => {
            dispatch(addArrowheadPreset(name, arrowhead));
        },
        onSaveArrowheadPreset: (arrowhead) => {
            dispatch(saveArrowheadPreset(arrowhead));
        },
        onDeleteArrowheadPreset: (presetName) => {
            dispatch(deleteArrowheadPreset(presetName));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArrowheadGUI);
