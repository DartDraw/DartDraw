import { connect } from 'react-redux';
import LeftMenu from './LeftMenu';
import {
    selectTool
} from './../../actions/menu';

const mapDispatchToProps = (dispatch) => {
    return {
        onToolSelect: (toolType) => {
            dispatch(selectTool(toolType));
        }
    };
};

export default connect(
    null,
    mapDispatchToProps
)(LeftMenu);
