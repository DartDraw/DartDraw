import { connect } from 'react-redux';
import RulerLayer from './RulerLayer';
import { setGridRulers } from './../../../actions/canvas';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { ruler, canvasWidth, canvasHeight, scale } = drawingState;
    const { showRulers } = menuState;
    return {
        ruler: ruler,
        width: Math.min(canvasWidth * scale, window.innerWidth - ruler.width - 45),
        height: Math.min(canvasHeight * scale, window.innerHeight - ruler.width - 45),
        showRulers: showRulers
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
