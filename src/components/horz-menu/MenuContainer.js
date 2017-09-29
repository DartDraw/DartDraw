import { connect } from 'react-redux';
import Menu from './Menu';
import {
    undoClick,
    redoClick,
    selectTool
} from './../../actions/menu';

const mapDispatchToProps = (dispatch) => {
    return {
        onUndoClick: () => {
            dispatch(undoClick());
        },
        onRedoClick: () => {
            dispatch(redoClick());
        },
        onToolSelect: (toolType) => {
            dispatch(selectTool(toolType));
        }
    };
};

export default connect(
    null,
    mapDispatchToProps
)(Menu);
