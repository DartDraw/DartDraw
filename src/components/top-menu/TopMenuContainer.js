import { connect } from 'react-redux';
import TopMenu from './TopMenu';
import {
    undoClick,
    redoClick,
    selectColor,
    selectPalette,
    addColor,
    removeColor,
    addPalette,
    removePalette,
    zoomIn,
    zoomOut,
    customZoom,
    groupButtonClick,
    ungroupButtonClick,
    moveBackward,
    moveForward,
    sendToBack,
    bringToFront
} from './../../actions/menu';

const mapStateToProps = ({ drawingState, menuState }) => {
    return {
        scale: drawingState.scale,
        currentPalette: menuState.palettes[menuState.currentPalette].colors
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onUndoClick: () => {
            dispatch(undoClick());
        },
        onRedoClick: () => {
            dispatch(redoClick());
        },
        onGroupClick: () => {
            dispatch(groupButtonClick());
        },
        onUngroupClick: () => {
            dispatch(ungroupButtonClick());
        },
        onMoveBackward: () => {
            dispatch(moveBackward());
        },
        onMoveForward: () => {
            dispatch(moveForward());
        },
        onSendToBack: () => {
            dispatch(sendToBack());
        },
        onBringToFront: () => {
            dispatch(bringToFront());
        },
        onColorSelect: (color) => { // replace with onColorSelect
            dispatch(selectColor(color));
        },
        onPaletteSelect: (paletteName) => {
            dispatch(selectPalette(paletteName));
        },
        onAddColor: (color) => {
            dispatch(addColor(color));
        },
        onRemoveColor: (color) => {
            dispatch(removeColor(color));
        },
        onAddPalette: (paletteName, paletteColors) => {
            dispatch(addPalette(paletteName, paletteColors));
        },
        onRemovePalette: (paletteName) => {
            dispatch(removePalette(paletteName));
        },
        onZoomIn: () => {
            dispatch(zoomIn());
        },
        onZoomOut: () => {
            dispatch(zoomOut());
        },
        onCustomZoom: (customScale) => {
            dispatch(customZoom(customScale));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopMenu);
