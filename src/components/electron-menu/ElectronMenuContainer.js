import { connect } from 'react-redux';
import {
    toggleSettingsModal,
    moveForward,
    toggleShowRulers,
    toggleShowGrid,
    toggleShowSubDivisions,
    groupButtonClick,
    ungroupButtonClick,
    moveBackward,
    sendToBack,
    flipHorizontal,
    flipVertical,
    bringToFront,
    setCustomZoom,
    selectTool,
    undoClick,
    redoClick,
    fileSave,
    fileOpen
} from '../../actions/menu';
import ElectronMenu from './ElectronMenu';

const mapStateToProps = ({ drawingState, menuState }) => {
    return {
        settingsModalVisible: menuState.showSettingsModal
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onToggleSettingsModal: () => {
            dispatch(toggleSettingsModal());
        },
        onMoveForward: () => {
            dispatch(moveForward());
        },
        onShowRulers: () => {
            dispatch(toggleShowRulers());
        },
        onShowGrid: () => {
            dispatch(toggleShowGrid());
        },
        onShowSubDivisions: () => {
            dispatch(toggleShowSubDivisions());
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
        onSetCustomZoom: (customScale) => {
            dispatch(setCustomZoom(customScale));
        },
        onToolSelect: (toolType) => {
            dispatch(selectTool(toolType));
        },
        onUndoClick: () => {
            dispatch(undoClick());
        },
        onRedoClick: () => {
            dispatch(redoClick());
        },
        onFileSave: (data) => {
            dispatch(fileSave(data));
        },
        onFileOpen: (data) => {
            dispatch(fileOpen(data));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ElectronMenu);
