import * as menuActions from '../actions/menu';
import * as menu from './caseFunctions/menu';
import * as grid from './caseFunctions/grid';
import * as rulers from './caseFunctions/rulers';
import * as arrowhead from './caseFunctions/arrowhead';
import { deepCopy } from './utilities/object';
import { setArrowheadType } from './utilities/arrowhead';

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
    rectangleRadius: {x: 50, y: 50},
    gridSnapping: false,
    showRulers: true,
    showSubDivisions: true,
    showGrid: true,
    showContextualMenu: true,
    currentArrowhead: setArrowheadType('triangle'),
    arrowheadPresets: []
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
        case menuActions.TOGGLE_GRID_SNAPPING:
            return grid.toggleGridSnapping(stateCopy, action, root);
        case menuActions.TOGGLE_SHOW_GRID:
            return grid.toggleShowGrid(stateCopy, action, root);
        case menuActions.TOGGLE_SHOW_SUBDIVISIONS:
            return grid.toggleShowSubDivisions(stateCopy, action, root);
        case menuActions.TOGGLE_SHOW_RULER:
            return rulers.toggleShowRulers(stateCopy, action, root);
        case menuActions.ARROWHEAD_HANDLE_DRAG:
            return arrowhead.arrowheadHandleDrag(stateCopy, action, root);
        case menuActions.CHANGE_ARROWHEAD_TYPE:
            return arrowhead.changeArrowheadType(stateCopy, action, root);
        case menuActions.CHANGE_ARROWHEAD_HEIGHT:
            return arrowhead.changeArrowheadHeight(stateCopy, action, root);
        case menuActions.CHANGE_ARROWHEAD_LENGTH:
            return arrowhead.changeArrowheadLength(stateCopy, action, root);
        case menuActions.CHANGE_ARROWHEAD_BARB_LENGTH:
            return arrowhead.changeArrowheadBarbLength(stateCopy, action, root);
        case menuActions.CHANGE_ARROWHEAD_RADIUS_X:
            return arrowhead.changeArrowheadRadiusX(stateCopy, action, root);
        case menuActions.CHANGE_ARROWHEAD_RADIUS_Y:
            return arrowhead.changeArrowheadRadiusY(stateCopy, action, root);
        case menuActions.EDIT_ARROWHEAD:
            return arrowhead.editArrowhead(stateCopy, action, root);
        case menuActions.TOGGLE_CONTEXTUAL_MENU:
            stateCopy.showContextualMenu = !stateCopy.showContextualMenu;
            return stateCopy;
        default:
            return stateCopy;
    }
}

export default menuState;
