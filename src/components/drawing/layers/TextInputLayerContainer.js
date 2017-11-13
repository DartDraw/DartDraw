import { connect } from 'react-redux';
import TextInputLayer from './TextInputLayer';
import { textInputChange, toggleTextInputFocus } from '../../../actions/canvas';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { textInputs } = drawingState;
    return { textInputs };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onHandleTextInputChange: (textId, value) => {
            dispatch(textInputChange(textId, value));
        },
        onFocus: () => {
            dispatch(toggleTextInputFocus(true));
        },
        onBlur: () => {
            dispatch(toggleTextInputFocus(false));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TextInputLayer);
