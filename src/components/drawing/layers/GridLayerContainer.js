import { connect } from 'react-redux';
import GridLayer from './GridLayer';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { canvasWidth, canvasHeight, scale, ruler } = drawingState;
    return {
        scale: scale,
        width: canvasWidth,
        height: canvasHeight,
        ticks: ruler.ticks
    };
};

export default connect(
    mapStateToProps
)(GridLayer);
