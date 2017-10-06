import * as menuActions from '../actions/menu';
import * as menu from './caseFunctions/menu';
import { deepCopy } from './utilities/object';

const initialState = {
    toolType: ''
};

function menuState(state = initialState, action) {
    const stateCopy = deepCopy(state);

    switch (action.type) {
        case menuActions.SELECT_TOOL:
            return menu.selectTool(stateCopy, action);
        default:
            return stateCopy;
    }
}

export default menuState;
