import { connect } from 'react-redux';
import {
    updateOpacity,
    colorUpdate
} from '../../actions/menu';
import PaletteEditor from './PaletteEditor';

const mapStateToProps = ({ menuState }) => {
    return {
        currentColor: menuState.color
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onUpdateOpacity: (opacity) => {
            dispatch(updateOpacity(opacity));
        },
        onColorUpdate: (colorPart, newValue) => {
            dispatch(colorUpdate(colorPart, newValue));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PaletteEditor);
