import { connect } from 'react-redux';
import TopMenu from './TopMenu';
import {
    undoClick,
    redoClick,
    selectColor,
    selectColorPalette,
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
        currentPalette: menuState.colorPalettes[menuState.currentPalette].colors
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
        onColorPaletteSelect: (colorPalette) => {
            dispatch(selectColorPalette(colorPalette));
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
