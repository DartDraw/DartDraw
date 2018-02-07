import { connect } from 'react-redux';
import TopMenu from './TopMenu';
import {
    undoClick,
    redoClick,
    selectColor,
    selectButton,
    selectPalette,
    addColor,
    removeColor,
    addPalette,
    removePalette
} from './../../actions/menu';

const mapStateToProps = ({ drawingState, menuState }) => {
    return {
        scale: drawingState.scale,
        fillColor: menuState.fillColor,
        strokeColor: menuState.strokeColor
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
        onColorSelect: (color) => { // replace with onColorSelect
            dispatch(selectColor(color));
        },

        onButtonSelect: (buttonInfo) => {
            dispatch(selectButton(buttonInfo));
        },
        onPaletteSelect: (paletteName) => {
            dispatch(selectPalette(paletteName));
        },
        onAddColor: (color) => {
            dispatch(addColor(color));
        },
        onRemoveColor: (color) => {
            dispatch(removeColor(color));
        },
        onAddPalette: (paletteName, paletteColors) => {
            dispatch(addPalette(paletteName, paletteColors));
        },
        onRemovePalette: (paletteName) => {
            dispatch(removePalette(paletteName));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopMenu);
