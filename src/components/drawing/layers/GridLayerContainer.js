import { connect } from 'react-redux';
import GridLayer from './GridLayer';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { canvasWidth, canvasHeight, gridLines, gridPreferences } = drawingState;
    return {
        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,
        lines: gridLines,
        showGrid: gridPreferences.showGrid,
        showSubDivisions: gridPreferences.showSubDivisions
    };
};

export default connect(
    mapStateToProps
)(GridLayer);
