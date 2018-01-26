import { connect } from 'react-redux';
import {
    updateOpacity
} from '../../actions/menu';
import ColorMenu from './ColorMenu';

const mapStateToProps = ({ drawingState, menuState }) => {
    const { shapes, selected } = drawingState;
    return {
        selectedShape: shapes.byId[selected[0]],
        scale: drawingState.scale,
        fillColor: menuState.fillColor,
        currentColor: menuState.color
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onUpdateOpacity: (opacity) => {
            dispatch(updateOpacity(opacity));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ColorMenu);
