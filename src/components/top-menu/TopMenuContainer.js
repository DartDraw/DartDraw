import { connect } from 'react-redux';
import TopMenu from './TopMenu';
import {
    undoClick,
    redoClick,
    selectColor,
    zoomIn,
    zoomOut,
    customZoom,
    groupButtonClick,
    ungroupButtonClick,
    moveBackward,
    moveForward,
    sendToBack,
    flipHorizontal,
    flipVertical,
    bringToFront,
    toggleGridSnapping,
    // updateRuler,
    selectButton
} from './../../actions/menu';

const mapStateToProps = ({ drawingState, menuState }) => {
    return {
        scale: drawingState.scale,
        fillColor: menuState.fillColor,
        strokeColor: menuState.strokeColor
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
        onFlipHorizontal: () => {
            dispatch(flipHorizontal());
        },
        onFlipVertical: () => {
            dispatch(flipVertical());
        },
        onColorSelect: (color) => { // replace with onColorSelect
            dispatch(selectColor(color));
        },
        onZoomIn: () => {
            dispatch(zoomIn());
        },
        onZoomOut: () => {
            dispatch(zoomOut());
        },
        onCustomZoom: (customScale) => {
            dispatch(customZoom(customScale));
        },
        onToggleGridSnapping: () => {
            dispatch(toggleGridSnapping());
        },
        // onUpdateRuler: () => {
        //     dispatch(updateRuler());
        // },
        onButtonSelect: (button) => {
            dispatch(selectButton(button));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopMenu);
