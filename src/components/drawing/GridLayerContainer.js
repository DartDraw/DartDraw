import { connect } from 'react-redux';
import GridLayer from './GridLayer';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { canvasWidth, canvasHeight } = drawingState;
    const { majorGrid, minorGrid } = menuState;
    return {
        width: canvasWidth,
        height: canvasHeight,
        majorGrid: majorGrid,
        minorGrid: minorGrid
    };
};

export default connect(
    mapStateToProps
)(GridLayer);
