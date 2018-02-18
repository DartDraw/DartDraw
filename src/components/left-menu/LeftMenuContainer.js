import { connect } from 'react-redux';
import LeftMenu from './LeftMenu';
import {
    selectTool,
    exportClick
} from './../../actions/menu';

const mapDispatchToProps = (dispatch) => {
    return {
        onToolSelect: (toolType) => {
            dispatch(selectTool(toolType));
        },
        onExportSelect: () => {
            dispatch(exportClick());
        }
    };
};

const mapStateToProps = ({ menuState }) => {
    const { toolType } = menuState;

    return {
        toolType
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LeftMenu);
