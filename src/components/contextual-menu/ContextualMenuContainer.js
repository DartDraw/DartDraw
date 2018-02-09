import { connect } from 'react-redux';
import {
    editShape,
    alignmentClick,
    toggleShowGrid,
    toggleShowRulers,
    toggleShowSubDivisions,
    setRulerGrid,
    setCustomZoom
} from '../../actions/menu';
import ContextualMenu from './ContextualMenu';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { shapes, selected, scale, ruler, canvasWidth, canvasHeight } = drawingState;
    return {
        selectedShape: shapes.byId[selected[0]],
        scale: scale,
        unitType: ruler.unitType,
        unitDivisions: ruler.unitDivisions,
        canvasWidthInUnits: canvasWidth / ruler.pixelsPerUnit,
        canvasHeightInUnits: canvasHeight / ruler.pixelsPerUnit,
        fillColor: menuState.fillColor
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
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ContextualMenu);
