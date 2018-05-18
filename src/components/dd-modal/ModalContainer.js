import { connect } from 'react-redux';
import {
    toggleSettingsModal,
    setRulerGrid,
    changeColorMode
} from '../../actions/menu';
import Modal from './Modal';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { shapes, selected, scale, ruler, canvasWidth, canvasHeight } = drawingState;
    const { docColorMode } = menuState;
    return {
        unitType: ruler.unitType,
        unitDivisions: ruler.unitDivisions,
        canvasWidthInUnits: canvasWidth / ruler.pixelsPerUnit,
        canvasHeightInUnits: canvasHeight / ruler.pixelsPerUnit,
        rulerNames: Object.keys(ruler.byName),
        settingsModalVisible: menuState.showSettingsModal,
        colorMode: menuState.docColorMode
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onToggleSettingsModal: () => {
            dispatch(toggleSettingsModal());
        },
        onSetRulerGrid: (canvasSpecs) => {
            dispatch(setRulerGrid(canvasSpecs));
        },
        onColorModeChange: (colorMode) => {
            dispatch(changeColorMode(colorMode));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal);
