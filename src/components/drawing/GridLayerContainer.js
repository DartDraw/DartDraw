import { connect } from 'react-redux';
import GridLayer from './GridLayer';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { canvasWidth, canvasHeight, scale } = drawingState;
    const { majorGrid, minorGrid } = menuState;
    return {
        scale: scale,
        width: canvasWidth,
        height: canvasHeight,
        majorGrid: majorGrid,
        minorGrid: minorGrid
    };
};

export default connect(
    mapStateToProps
)(GridLayer);
