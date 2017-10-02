import { connect } from 'react-redux';
import TopMenu from './TopMenu';
import {
    undoClick,
    redoClick,
    selectColor
} from './../../actions/menu';

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
        }
    };
};

export default connect(
    null,
    mapDispatchToProps
)(TopMenu);
