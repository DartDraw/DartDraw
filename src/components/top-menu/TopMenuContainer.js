import { connect } from 'react-redux';
import TopMenu from './TopMenu';
import {
    undoClick,
    redoClick,
    selectColor,
    groupClick,
    sendToBack,
    bringToFront
} from './../../actions/menu';

const mapDispatchToProps = (dispatch) => {
    return {
        onUndoClick: () => {
            dispatch(undoClick());
        },
        onRedoClick: () => {
            dispatch(redoClick());
        },
        onGroupClick: () => {
            dispatch(groupClick());
        },
        onSendToBack: () => {
            dispatch(sendToBack());
        },
        onBringToFront: () => {
            dispatch(bringToFront());
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
