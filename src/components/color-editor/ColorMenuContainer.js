import { connect } from 'react-redux';
import {
    updateOpacity,
    addColor,
    changeColorType,
    selectColor,
    setPickerType
} from '../../actions/menu';
import ColorMenu from './ColorMenu';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { shapes, selected } = drawingState;
    return {
        selectedShape: shapes.byId[selected[0]],
        scale: drawingState.scale,
        fillColor: menuState.fillColor.rgba,
        currentColor: menuState.color.rgba,
        palettes: menuState.palettes,
        currentPalette: menuState.currentPalette,
        colorType: menuState.colorType,
        pickerType: menuState.colorPickerType
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
        onChangeColorType: (colorType) => {
            dispatch(changeColorType(colorType));
        },
        onSelectColor: (colorObj) => {
            dispatch(selectColor(colorObj));
        },
        onSetPickerType: (pickerType) => {
            dispatch(setPickerType(pickerType));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ColorMenu);
