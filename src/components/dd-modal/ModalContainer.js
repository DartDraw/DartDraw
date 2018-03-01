import { connect } from 'react-redux';
import {
    toggleSettingsModal,
    setRulerGrid
} from '../../actions/menu';
import Modal from './Modal';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { shapes, selected, scale, ruler, canvasWidth, canvasHeight } = drawingState;
    const { currentKeys} = menuState;
    return {
        unitType: ruler.unitType,
        unitDivisions: ruler.unitDivisions,
        canvasWidthInUnits: canvasWidth / ruler.pixelsPerUnit,
        canvasHeightInUnits: canvasHeight / ruler.pixelsPerUnit,
        rulerNames: Object.keys(ruler.byName),
        settingsModalVisible: menuState.showSettingsModal
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onToggleSettingsModal: () => {
            dispatch(toggleSettingsModal());
        },
        onSetRulerGrid: (canvasSpecs) => {
            dispatch(setRulerGrid(canvasSpecs));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal);
