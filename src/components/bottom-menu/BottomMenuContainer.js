import { connect } from 'react-redux';
import BottomMenu from './BottomMenu';
import { scroll } from './../../actions/canvas';

const mapStateToProps = ({ drawingState, menuState }) => {
    return {
        scrollX: drawingState.panX
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onScroll: () => {
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BottomMenu);
