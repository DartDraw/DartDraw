import { connect } from 'react-redux';
import BackgroundLayer from './BackgroundLayer';

const mapStateToProps = ({ drawingState }) => {
    const { canvasWidth, canvasHeight, canvasFill } = drawingState;
    return {
        width: canvasWidth,
        height: canvasHeight,
        fill: canvasFill
    };
};

export default connect(
    mapStateToProps,
    null
)(BackgroundLayer);
