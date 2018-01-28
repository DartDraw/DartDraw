import { connect } from 'react-redux';
import GridLayer from './GridLayer';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { canvasWidthInPixels, canvasHeightInPixels, gridLines, gridPreferences } = drawingState;
    return {
        canvasWidthInPixels: canvasWidthInPixels,
        canvasHeightInPixels: canvasHeightInPixels,
        lines: gridLines,
        showGrid: gridPreferences.showGrid,
        showSubDivisions: gridPreferences.showSubDivisions
    };
};

export default connect(
    mapStateToProps
)(GridLayer);
