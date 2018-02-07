import * as menuActions from '../actions/menu';
import * as menu from './caseFunctions/menu';
import * as grid from './caseFunctions/grid';
import * as rulers from './caseFunctions/rulers';
import { deepCopy } from './utilities/object';

const initialState = {
    color: {r: 33, g: 15, b: 243, a: 1},
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
    currentPalette: 'Primary',

    palettes: [
        {
            name: 'Default',
            colors: ["rgba(255,255,255,1)", "rgba(244,67,54,1)", "rgba(233,30,99,1)", "rgba(156,39,176,1)", "rgba(103,58,183,1)", "rgba(63,81,181,1)", "rgba(33,150,243,1)", "rgba(3,169,244,1)", "rgba(0,188,212,1)", "rgba(0,150,136,1)", "rgba(76,175,80,1)", "rgba(139,195,74,1)", "rgba(205,220,57,1)", "rgba(255,235,59,1)", "rgba(255,193,7,1)", "rgba(255,152,0,1)", "rgba(255,87,34,1)", "rgba(121,85,72,1)"]
        },
        {
            name: 'Tri',
            colors: ["rgba(255,0,0,1)", "rgba(0,0,255,1)", "rgba(255,255,0,1)"]
        },
        {
            name: 'Primary',
            colors: [{r: '255', g: '0', b: '0', a: '1'}, {r: '0', g: '0', b: '255', a: '1'}, {r: '255', g: '255', b: '0', a: '1'}]
        }
    ],
    gridSnapping: false,
    showRulers: true,
    showSubDivisions: true,
    showGrid: true
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
        case menuActions.UPDATE_OPACITY:
            return menu.updateOpacity(stateCopy, action);
        case menuActions.COLOR_UPDATE:
            return menu.colorUpdate(stateCopy, action);
        case menuActions.TOGGLE_SHOW_GRID:
            return grid.toggleShowGrid(stateCopy, action, root);
        case menuActions.TOGGLE_SHOW_SUBDIVISIONS:
            return grid.toggleShowSubDivisions(stateCopy, action, root);
        case menuActions.TOGGLE_SHOW_RULER:
            return rulers.toggleShowRulers(stateCopy, action, root);
        default:
            return stateCopy;
    }
}

export default menuState;
