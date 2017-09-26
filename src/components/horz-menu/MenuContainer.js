import { connect } from 'react-redux';
import Menu from './Menu';
import {
    undoClick,
    redoClick,
    canvasDragStart,
    canvasDrag,
    canvasDragStop
} from './../../actions/actions';

const mapStateToProps = (state) => {
    const currentTool = state.toolState;

    return currentTool;
};

const mapDispatchToProps = (dispatch) => {
    return {
      onCallAction: ({ userAction }) => {
        dispatch(actionButtonClick({ userAction }));
      },
      onSelectTool: ({ toolType }) => {
        dispatch(selectTool({ toolType}));
      }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Menu);
