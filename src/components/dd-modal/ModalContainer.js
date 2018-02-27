import { connect } from 'react-redux';
import {
    editShape

} from '../../actions/menu';
import Modal from './Modal';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { shapes, selected, scale, ruler, canvasWidth, canvasHeight } = drawingState;
    const { currentKeys } = menuState;
    return {

    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Modal);
