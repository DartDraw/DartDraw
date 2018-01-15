import { connect } from 'react-redux';
import RulerLayer from './RulerLayer';
import { updateRuler } from './../../../actions/canvas';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { panX, scale, canvasWidth, canvasHeight, ruler } = drawingState;
    return {
        ticks: ruler.ticks,
        labels: ruler.labels,
        windowWidth: window.innerWidth,
        viewBox: [panX, 0, window.innerWidth, 30]
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        onUpdateRuler: () => {
            dispatch(updateRuler());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RulerLayer);
