import { connect } from 'react-redux';
import RulerLayer from './RulerLayer';
import { setGridRulers, setCanvasSize } from './../../../actions/canvas';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { rulerPreferences, ruler, canvasWidthInPixels, canvasHeightInPixels, scale } = drawingState;
    return {
        ruler: ruler,
        rulerWidth: ruler.pixelWidth,
        width: Math.min(canvasWidthInPixels * scale, window.innerWidth - ruler.pixelWidth - 45),
        height: Math.min(canvasHeightInPixels * scale, window.innerHeight - ruler.pixelWidth - 45),
        showRulers: rulerPreferences.showRulers
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        onSetGridRulers: () => {
            dispatch(setGridRulers());
        },
        onSetCanvasSize: (width, height) => {
            dispatch(setCanvasSize(width, height));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RulerLayer);
