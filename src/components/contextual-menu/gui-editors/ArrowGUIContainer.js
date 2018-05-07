import { connect } from 'react-redux';
import ArrowGUI from './ArrowGUI';
import {
    arrowHandleDrag,
    toggleArrowAspect,
    toggleArrowMode,
    toggleArrowShow,
    toggleArrowFlip,
    changeArrowHeight,
    changeArrowLength,
    changeArrowBarbLength,
    changeArrowRadiusX,
    changeArrowRadiusY,
    selectArrowPreset,
    addArrowPreset,
    saveArrowPreset,
    deleteArrowPreset
} from '../../../actions/menu';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { shapes, arrowMode, lockAspectRatio, selected } = drawingState;

    const arrowShown = arrowMode === "head" ? shapes.byId[selected[0]].arrowHeadShown : shapes.byId[selected[0]].arrowTailShown;
    const selectedArrow = arrowMode === "head" ? shapes.arrows.byId[shapes.byId[selected[0]].arrowHeadId] : shapes.arrows.byId[shapes.byId[selected[0]].arrowTailId];

    return {
        arrowMode,
        arrowShown,
        selectedArrow,
        lockAspectRatio,
        arrows: shapes.arrows,
        presetNames: Object.keys(shapes.arrows.presets),
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
        onToggleArrowMode: (mode) => {
            dispatch(toggleArrowMode(mode));
        },
        onToggleArrowShow: () => {
            dispatch(toggleArrowShow());
        },
        onToggleArrowFlip: (arrowId) => {
            dispatch(toggleArrowFlip(arrowId));
        },
        onHeightChange: (height) => {
            dispatch(changeArrowHeight(height));
        },
        onLengthChange: (length) => {
            dispatch(changeArrowLength(length));
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
