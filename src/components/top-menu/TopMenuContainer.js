import { connect } from 'react-redux';
import TopMenu from './TopMenu';
import {
    undoClick,
    redoClick,
    selectColor,
    selectButton
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
        onButtonSelect: (button) => {
            dispatch(selectButton(button));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopMenu);
