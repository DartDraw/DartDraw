import { connect } from 'react-redux';
import {
    updateOpacity,
    colorUpdate,
    addColor,
    selectColor,
    selectPalette
} from '../../actions/menu';
import PaletteEditor from './PaletteEditor';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { shapes, selected } = drawingState;
    return {
        selectedShape: shapes.byId[selected[0]],
        scale: drawingState.scale,
        fillColor: menuState.fillColor,
        currentColor: menuState.color,
        palettes: menuState.palettes,
        currentPalette: menuState.currentPalette
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onUpdateOpacity: (opacity) => {
            dispatch(updateOpacity(opacity));
        },
        onColorUpdate: (colorPart, newValue) => {
            dispatch(colorUpdate(colorPart, newValue));
        },
        onAddColor: (colorObj) => {
            dispatch(addColor(colorObj));
        },
        onSelectColor: (colorObj) => {
            dispatch(selectColor(colorObj));
        },
        onSelectPalette: (paletteName) => {
            dispatch(selectPalette(paletteName));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PaletteEditor);
