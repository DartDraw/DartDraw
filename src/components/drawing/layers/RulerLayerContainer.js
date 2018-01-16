import { connect } from 'react-redux';
import RulerLayer from './RulerLayer';
import { setRulers } from './../../../actions/canvas';
import { setGrid } from './../../../actions/menu';

const mapStateToProps = ({ drawingState, menuState }) => {
    return {
        ruler: drawingState.ruler,
        rulerWidth: drawingState.ruler.pixelWidth
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
