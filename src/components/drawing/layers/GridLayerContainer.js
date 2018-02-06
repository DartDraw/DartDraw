import { connect } from 'react-redux';
import GridLayer from './GridLayer';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { canvasWidth, canvasHeight, ruler, scale, panX, panY } = drawingState;
    const { showGrid, showSubDivisions } = menuState;
    return {
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        ruler: ruler,
        panX: panX,
        panY: panY,
        scale: scale,
        showGrid: showGrid,
        showSubDivisions: showSubDivisions
    };
};

export default connect(
    mapStateToProps
)(GridLayer);
