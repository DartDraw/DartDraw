import { connect } from 'react-redux';
import RulerLayer from './RulerLayer';
import { updateRuler } from './../../../actions/canvas';
import { updateGrid } from './../../../actions/menu';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { ruler } = drawingState;
    return {
        ticks: ruler.ticks,
        labels: ruler.labels,
        innerWidth: window.innerWidth,
        panX: drawingState.panX,
        viewBox: [drawingState.panX, 0, window.innerWidth - 30 - 45, 30]
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        onUpdateRuler: () => {
            dispatch(updateRuler());
        },
        onUpdateGrid: () => {
            dispatch(updateGrid());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RulerLayer);
