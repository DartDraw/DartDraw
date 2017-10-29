import { connect } from 'react-redux';
import BackgroundLayer from './BackgroundLayer';

const mapStateToProps = ({ drawingState }) => {
    const { canvasWidth, canvasHeight } = drawingState;
    return {
        width: canvasWidth,
        height: canvasHeight,
        fill: 'black'
    };
};

export default connect(
    mapStateToProps
)(BackgroundLayer);
