import { connect } from 'react-redux';
import ArrowGUI from './ArrowGUI';
import {
    arrowHandleDrag,
    toggleArrowAspect,
    toggleArrowShown,
    changeArrowHeight,
    changearrowHeadLength,
    changeArrowBarbLength,
    changeArrowRadiusX,
    changeArrowRadiusY,
    selectArrowPreset,
    addArrowPreset,
    saveArrowPreset,
    deleteArrowPreset
} from '../../../actions/menu';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { shapes, arrows, lockAspectRatio, selected } = drawingState;

    const selectedArrow = arrows.byId[shapes.byId[selected[0]].arrowheadId];

    return {
        arrows,
        selectedArrow,
        lockAspectRatio,
        presetNames: Object.keys(arrows.presets),
        defaultPresets: ["triangle", "barbed", "ellipse", "rectangle", "polyline"]
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onArrowHandleDrag: (shapeId, handleIndex, draggableData) => {
            dispatch(arrowHandleDrag(shapeId, handleIndex, draggableData));
        },
        onToggleArrowAspect: () => {
            dispatch(toggleArrowAspect());
        },
        onToggleArrowShown: (mode) => {
            dispatch(toggleArrowShown(mode));
        },
        onHeightChange: (height) => {
            dispatch(changeArrowHeight(height));
        },
        onLengthChange: (length) => {
            dispatch(changearrowHeadLength(length));
        },
        onBarbLengthChange: (length) => {
            dispatch(changeArrowBarbLength(length));
        },
        onRadiusXChange: (rx) => {
            dispatch(changeArrowRadiusX(rx));
        },
        onRadiusYChange: (ry) => {
            dispatch(changeArrowRadiusY(ry));
        },
        onSelectArrowPreset: (name) => {
            dispatch(selectArrowPreset(name));
        },
        onAddArrowPreset: (name, arrow) => {
            dispatch(addArrowPreset(name, arrow));
        },
        onSaveArrowPreset: (arrow) => {
            dispatch(saveArrowPreset(arrow));
        },
        onDeleteArrowPreset: (presetName) => {
            dispatch(deleteArrowPreset(presetName));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArrowGUI);
