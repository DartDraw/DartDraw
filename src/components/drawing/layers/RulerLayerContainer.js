import { connect } from 'react-redux';
import RulerLayer from './RulerLayer';
import { setGridRulers } from './../../../actions/canvas';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { rulerPreferences, ruler, canvasWidthInPixels, canvasHeightInPixels, scale } = drawingState;
    return {
        ruler: ruler,
        rulerWidth: ruler.rulerWidth,
        width: Math.min(canvasWidthInPixels * scale, window.innerWidth - ruler.rulerWidth - 45),
        height: Math.min(canvasHeightInPixels * scale, window.innerHeight - ruler.rulerWidth - 45),
        showRulers: rulerPreferences.showRulers
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        onSetGridRulers: () => {
            dispatch(setGridRulers());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RulerLayer);
