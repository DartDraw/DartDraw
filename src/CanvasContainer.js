import { connect } from 'react-redux';
import Canvas from './Canvas';
import { addShape } from './actions';

const mapStateToProps = (state) => {
    return {
        drawingArray: state.drawingArray
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onCanvasClick: (shape) => {
            dispatch(addShape(shape));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Canvas);
