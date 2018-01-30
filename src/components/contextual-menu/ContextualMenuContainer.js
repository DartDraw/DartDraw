import { connect } from 'react-redux';
import {
    editShape,
    alignmentClick,
    groupButtonClick,
    ungroupButtonClick,
    moveBackward,
    moveForward,
    sendToBack,
    flipHorizontal,
    flipVertical,
    bringToFront,
    toggleGridSnapping,
    zoomIn,
    zoomOut,
    customZoom,
    toggleShowGrid,
    toggleShowRulers,
    toggleShowSubDivisions,
    setUnitType,
    setUnitDivisions
} from '../../actions/menu';
import { setCanvasSize } from '../../actions/canvas';
import ContextualMenu from './ContextualMenu';

const mapStateToProps = ({ drawingState }) => {
    const { shapes, selected, scale, ruler, canvasWidthInPixels, canvasHeightInPixels, canvasWidthInUnits, canvasHeightInUnits } = drawingState;
    return {
        selectedShape: shapes.byId[selected[0]],
        scale: scale,
        ruler: ruler,
        unitDivisions: ruler.unitDivisions,
        canvasWidthInPixels: canvasWidthInPixels,
        canvasHeightInPixels: canvasHeightInPixels,
        canvasWidthInUnits: canvasWidthInUnits,
        canvasHeightInUnits: canvasHeightInUnits
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        editShape: (shape) => {
            dispatch(editShape(shape));
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
        onShowGrid: () => {
            dispatch(toggleShowGrid());
        },
        onShowRulers: () => {
            dispatch(toggleShowRulers());
        },
        onShowSubDivisions: () => {
            dispatch(toggleShowSubDivisions());
        },
        onSetUnitType: (unitType) => {
            dispatch(setUnitType(unitType));
        },
        onSetUnitDivisions: (unitDivisions) => {
            dispatch(setUnitDivisions(unitDivisions));
        },
        onSetCanvasSize: (width, height) => {
            dispatch(setCanvasSize(width, height));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ContextualMenu);
