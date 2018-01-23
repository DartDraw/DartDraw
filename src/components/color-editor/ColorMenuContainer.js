import { connect } from 'react-redux';
import ColorMenu from './ColorMenu';
import {
    editShape,
    changeColorMode
} from '../../actions/menu';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { shapes, selected } = drawingState;
    return {
        selectedShape: shapes.byId[selected[0]],
        scale: drawingState.scale,
        fillColor: menuState.fillColor,
        colorMode: menuState.colorMode
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        editShape: (shape) => {
            dispatch(editShape(shape));
        },
        onChangeColorMode: (colorMode) => {
            dispatch(changeColorMode(colorMode));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ColorMenu);
