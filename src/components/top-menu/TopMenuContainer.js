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
    sendToBack,
    bringToFront
} from './../../actions/menu';

const mapStateToProps = ({ drawingState }) => {
    return {
        scale: drawingState.scale
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
