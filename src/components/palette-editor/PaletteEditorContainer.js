import { connect } from 'react-redux';
import {
    updateOpacity,
    addColor,
    selectColor,
    selectPalette,
    addPalette,
    removeColor,
    removePalette
} from '../../actions/menu';
import PaletteEditor from './PaletteEditor';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { shapes, selected } = drawingState;
    return {
        selectedShape: shapes.byId[selected[0]],
        scale: drawingState.scale,
        fillColor: menuState.fillColor.rgba,
        currentColor: menuState.color.rgba,
        palettes: menuState.palettes,
        currentPalette: menuState.currentPalette
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onUpdateOpacity: (opacity) => {
            dispatch(updateOpacity(opacity));
        },
        onAddColor: (colorObj) => {
            dispatch(addColor(colorObj));
        },
        onSelectColor: (colorObj) => {
            dispatch(selectColor(colorObj));
        },
        onSelectPalette: (paletteName) => {
            dispatch(selectPalette(paletteName));
        },
        onAddPalette: (paletteName) => {
            dispatch(addPalette(paletteName));
        },
        onRemoveColor: (colorObj) => {
            dispatch(removeColor(colorObj));
        },
        onDeletePalette: (paletteName) => {
            dispatch(removePalette(paletteName));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PaletteEditor);
