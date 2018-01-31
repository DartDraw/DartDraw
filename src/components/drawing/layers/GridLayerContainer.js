import { connect } from 'react-redux';
import GridLayer from './GridLayer';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { canvasWidth, canvasHeight, gridLines } = drawingState;
    const { showGrid, showSubDivisions } = menuState;
    return {
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        lines: gridLines,
        showGrid: showGrid,
        showSubDivisions: showSubDivisions
    };
};

export default connect(
    mapStateToProps
)(GridLayer);
