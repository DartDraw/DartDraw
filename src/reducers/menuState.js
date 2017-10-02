import * as menuActions from '../actions/menu';
import * as menu from './caseFunctions/menu';
import { deepCopy } from './utilities/object';

const initialState = {
    color: { r: 33, g: 150, b: 243, a: 1 },
    toolType: '',
    currentKeys: {}
};

function menuState(state = initialState, action) {
    const stateCopy = deepCopy(state);

    switch (action.type) {
        case menuActions.KEY_DOWN:
            return menu.keyDown(stateCopy, action);
        case menuActions.KEY_UP:
            return menu.keyUp(stateCopy, action);
        case menuActions.SELECT_TOOL:
            return menu.selectTool(stateCopy, action);
        case menuActions.SELECT_COLOR:
            return menu.selectColor(stateCopy, action);
        default:
            return stateCopy;
    }
}

export default menuState;
