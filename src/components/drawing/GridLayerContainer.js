import { connect } from 'react-redux';
import GridLayer from './GridLayer';

const mapStateToProps = ({ drawingState }) => {
    const { canvasWidth, canvasHeight } = drawingState;
    return {
        width: canvasWidth,
        height: canvasHeight
    };
};

export default connect(
    mapStateToProps
)(GridLayer);
