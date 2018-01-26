import * as menuActions from '../actions/menu';
import * as menu from './caseFunctions/menu';
import { deepCopy } from './utilities/object';

const initialState = {
    color: { r: 33, g: 150, b: 243, a: 1 },
    fillColor: {r: 33, g: 15, b: 243, a: 1},
    strokeColor: {r: 200, g: 0, b: 200, a: 1},
    toolType: '',
    fillStrokeButton: 'fill',
    currentKeys: {},
    copied: false,
    pasted: false,
    align: ['top', 'left'],
    centeredControl: false,
    rectangleRadius: {x: 50, y: 50}
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
        case menuActions.SELECT_BUTTON:
            return menu.selectButton(stateCopy, action, root);
        case menuActions.SELECT_COLOR:
            return menu.selectColor(stateCopy, action, root);
        case menuActions.ALIGNMENT_CHANGE:
            return menu.selectAlignment(stateCopy, action, root);
        case menuActions.SET_GRID:
            return grid.setGrid(stateCopy, action, root);
        case menuActions.TOGGLE_GRID_SNAPPING:
            return grid.toggleGridSnapping(stateCopy, action, root);
        default:
            return stateCopy;
    }
}

export default menuState;
