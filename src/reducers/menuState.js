import * as menuActions from '../actions/menu';
import * as menu from './caseFunctions/menu';
import * as grid from './caseFunctions/grid';
import { deepCopy } from './utilities/object';

const initialState = {
    color: { r: 33, g: 150, b: 243, a: 1 },
    toolType: '',
    currentKeys: {},
    unitType: 'inch',
    majorGrid: 100,
    minorGrid: 10
};

function menuState(state = initialState, action, root) {
    const stateCopy = deepCopy(state);

    switch (action.type) {
        case menuActions.KEY_DOWN:
            return menu.keyDown(stateCopy, action, root);
        case menuActions.KEY_UP:
            return menu.keyUp(stateCopy, action, root);
        case menuActions.SELECT_TOOL:
            return menu.selectTool(stateCopy, action, root);
        case menuActions.SELECT_COLOR:
            return menu.selectColor(stateCopy, action, root);
        case menuActions.SET_GRID:
            return grid.setGrid(stateCopy, action, root);
        default:
            return stateCopy;
    }
}

export default menuState;
