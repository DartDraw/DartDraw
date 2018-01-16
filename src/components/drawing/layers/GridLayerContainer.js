import { connect } from 'react-redux';
import GridLayer from './GridLayer';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { canvasWidth, canvasHeight, gridLines } = drawingState;
    return {
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        lines: gridLines
    };
};

export default connect(
    mapStateToProps
)(GridLayer);
