import { connect } from 'react-redux';
import TopMenu from './TopMenu';
import {
    undoClick,
    redoClick,
    selectColor,
    zoomIn,
    zoomOut,
    groupButtonClick,
    ungroupButtonClick,
    sendToBack,
    bringToFront
} from './../../actions/menu';

const mapStateToProps = ({ drawingState }) => {
    return {
        scale: drawingState.canvasTransformationMatrix[0]
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
        onSendToBack: () => {
            dispatch(sendToBack());
        },
        onBringToFront: () => {
            dispatch(bringToFront());
        },
        onColorSelect: (color) => { // replace with onColorSelect
            dispatch(selectColor(color));
        },
        onZoomIn: () => {
            dispatch(zoomIn());
        },
        onZoomOut: () => {
            dispatch(zoomOut());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopMenu);
