import { connect } from 'react-redux';
import GridLayer from './GridLayer';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { canvasWidth, scale, canvasHeight, gridLines, ruler } = drawingState;
    const { showGrid, showSubDivisions } = menuState;
    return {
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        lines: ruler.horizontal.ticks,
        scale: scale,
        showGrid: showGrid,
        showSubDivisions: showSubDivisions
    };
};

export default connect(
    mapStateToProps
)(GridLayer);
