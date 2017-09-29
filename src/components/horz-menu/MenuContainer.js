import { connect } from 'react-redux';
import Menu from './Menu';
import {
    undoClick,
    redoClick,
    // selectTool
} from './../../actions/actions';


const mapDispatchToProps = (dispatch) => {
    return {
      onUndoClick: () => {
          dispatch(undoClick());
      },
      onRedoClick: () => {
          dispatch(redoClick());
      },
      onToolSelect: (toolType) => {
          dispatch(undoClick()); // should be selectTool(toolType)
      }
    };
};

export default connect(
    null,
    mapDispatchToProps
)(Menu);
