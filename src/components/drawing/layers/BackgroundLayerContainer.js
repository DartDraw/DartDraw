import { connect } from 'react-redux';
import BackgroundLayer from './BackgroundLayer';

const mapStateToProps = ({ drawingState }) => {
    const { canvasWidthInPixels, canvasHeightInPixels } = drawingState;
    return {
        width: canvasWidthInPixels,
        height: canvasHeightInPixels,
        fill: 'white'
    };
};

export default connect(
    mapStateToProps
)(BackgroundLayer);
