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

};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Menu);
