import { connect } from 'react-redux';
import RulerLayer from './RulerLayer';
import { setRulers } from './../../../actions/canvas';
import { setGrid } from './../../../actions/menu';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { rulerPreferences, ruler, canvasWidth, canvasHeight, scale } = drawingState;
    return {
        ruler: ruler,
        rulerWidth: ruler.pixelWidth,
        width: Math.min(canvasWidth * scale, window.innerWidth - ruler.pixelWidth - 45),
        height: Math.min(canvasHeight * scale, window.innerHeight - ruler.pixelWidth - 45),
        showRulers: rulerPreferences.showRulers
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        onSetRulers: () => {
            dispatch(setRulers());
        },
        onSetGrid: () => {
            dispatch(setGrid());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RulerLayer);
