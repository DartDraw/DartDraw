import { connect } from 'react-redux';
import LeftMenu from './LeftMenu';
import {
    selectTool
    // exportClick
} from './../../actions/menu';

const mapDispatchToProps = (dispatch) => {
    return {
        onToolSelect: (toolType) => {
            dispatch(selectTool(toolType));
        }
        // onExportSelect: () => {
        //     dispatch(exportClick());
        // }
    };
};

export default connect(
    null,
    mapDispatchToProps
)(LeftMenu);
