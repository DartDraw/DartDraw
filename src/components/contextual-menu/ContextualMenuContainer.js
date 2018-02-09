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
    setCustomZoom,
    toggleGridSnapping,
    toggleShowGrid,
    toggleShowRulers,
    toggleShowSubDivisions,
    setRulerGrid,
    selectRuler,
    addRuler,
    saveRuler,
    deleteRuler
} from '../../actions/menu';
import ContextualMenu from './ContextualMenu';

const mapStateToProps = ({ drawingState }) => {
    const { shapes, selected, scale, ruler, canvasWidth, canvasHeight } = drawingState;
    return {
        selectedShape: shapes.byId[selected[0]],
        scale: scale,
        unitType: ruler.unitType,
        unitDivisions: ruler.unitDivisions,
        canvasWidthInUnits: canvasWidth / ruler.pixelsPerUnit,
        canvasHeightInUnits: canvasHeight / ruler.pixelsPerUnit,
        rulerNames: ruler.names,
        currentRuler: ruler.current
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
        onSetCustomZoom: (customScale) => {
            dispatch(setCustomZoom(customScale));
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
        onSetRulerGrid: (canvasSpecs) => {
            dispatch(setRulerGrid(canvasSpecs));
        },
        onSelectRuler: (rulerName) => {
            dispatch(selectRuler(rulerName));
        },
        onAddRuler: (rulerSpecs) => {
            dispatch(addRuler(rulerSpecs));
        },
        onSaveRuler: (rulerSpecs) => {
            dispatch(saveRuler(rulerSpecs));
        },
        onDeleteRuler: () => {
            dispatch(deleteRuler());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ContextualMenu);
