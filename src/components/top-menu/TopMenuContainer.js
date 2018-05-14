import { connect } from 'react-redux';
import TopMenu from './TopMenu';
import {
    undoClick,
    redoClick,
    selectColor,
    selectButton,
    alignmentClick,
    groupButtonClick,
    ungroupButtonClick,
    moveBackward,
    moveForward,
    sendToBack,
    flipHorizontal,
    flipVertical,
    bringToFront,
    toggleGridSnapping
} from './../../actions/menu';

const mapStateToProps = ({ drawingState, menuState }) => {
    return {
        scale: drawingState.scale,
        fillColor: menuState.fillColor.rgba,
        strokeColor: menuState.strokeColor.rgba
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
        onColorSelect: (color) => { // replace with onColorSelect
            dispatch(selectColor(color));
        },
        onButtonSelect: (buttonInfo) => {
            dispatch(selectButton(buttonInfo));
        },
        onAllignmentClick: (id) => {
            dispatch(alignmentClick(id));
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
        onToggleGridSnapping: () => {
            dispatch(toggleGridSnapping());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopMenu);
