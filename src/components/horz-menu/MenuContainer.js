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
      onCallUserAction: ({ userAction }) => {
        dispatch(callUserAction({ userAction }));
      },
      onSelectToolType: ({ toolType }) => {
        dispatch(selectToolType({ toolType}));
      }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Menu);
