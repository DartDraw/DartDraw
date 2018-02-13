export const EDIT_SHAPE = 'EDIT_SHAPE';
export const KEY_DOWN = 'KEY_DOWN';
export const KEY_UP = 'KEY_UP';
export const MOUSE_MOVE = 'MOUSE_MOVE';
export const SELECT_TOOL = 'SELECT_TOOL';
export const EXPORT_CLICK = 'EXPORT_CLICK';
export const SELECT_COLOR = 'SELECT_COLOR';
export const UNDO_CLICK = 'UNDO_CLICK';
export const REDO_CLICK = 'REDO_CLICK';
export const SET_CUSTOM_ZOOM = 'SET_CUSTOM_ZOOM';
export const ALIGNMENT_CHANGE = 'ALIGNMENT_CHANGE';
export const GROUP_BUTTON_CLICK = 'GROUP_BUTTON_CLICK';
export const UNGROUP_BUTTON_CLICK = 'UNGROUP_BUTTON_CLICK';
export const MOVE_BACKWARD = 'MOVE_BACKWARD';
export const MOVE_FORWARD = 'MOVE_FORWARD';
export const SEND_BACK = 'SEND_BACK';
export const BRING_FRONT = 'BRING_FRONT';
export const FLIP_HORIZONTAL = 'FLIP_HORIZONTAL';
export const FLIP_VERTICAL = 'FLIP_VERTICAL';
export const TOGGLE_GRID_SNAPPING = 'TOGGLE_GRID_SNAPPING';
export const SELECT_BUTTON = 'SELECT_BUTTON';
export const FILE_OPEN = 'FILE_OPEN';
export const FILE_SAVE = 'FILE_SAVE';
export const TOGGLE_SHOW_GRID = 'TOGGLE_SHOW_GRID';
export const TOGGLE_SHOW_RULER = 'TOGGLE_SHOW_RULER';
export const TOGGLE_SHOW_SUBDIVISIONS = 'TOGGLE_SHOW_SUBDIVISIONS';
export const SET_RULER_GRID = 'SET_RULER_GRID';

export function editShape(shape) {
    return { type: EDIT_SHAPE, payload: { shape } };
}

export function keyDown(keyCode) {
    return { type: KEY_DOWN, payload: { keyCode } };
}

export function keyUp(keyCode) {
    return { type: KEY_UP, payload: { keyCode } };
}

export function mouseMove(coord) {
    return { type: MOUSE_MOVE, payload: coord };
}

export function selectTool(toolType) {
    return { type: SELECT_TOOL, payload: { toolType } };
}

export function selectButton(button) {
    return { type: SELECT_BUTTON, payload: { button } };
}

export function exportClick() {
    return { type: EXPORT_CLICK };
}

export function selectColor(color) {
    return { type: SELECT_COLOR, payload: { color } };
}

export function undoClick() {
    return { type: UNDO_CLICK };
}

export function redoClick() {
    return { type: REDO_CLICK };
}

export function setCustomZoom(customScale) {
    return { type: SET_CUSTOM_ZOOM, payload: { customScale } };
}

export function alignmentClick(id) {
    return { type: ALIGNMENT_CHANGE, payload: { id } };
}

export function groupButtonClick() {
    return { type: GROUP_BUTTON_CLICK };
}

export function ungroupButtonClick() {
    return { type: UNGROUP_BUTTON_CLICK };
}

export function moveBackward() {
    return { type: MOVE_BACKWARD };
}

export function moveForward() {
    return { type: MOVE_FORWARD };
}

export function sendToBack() {
    return { type: SEND_BACK };
}

export function bringToFront() {
    return { type: BRING_FRONT };
}

export function flipHorizontal() {
    return { type: FLIP_HORIZONTAL };
}

export function flipVertical() {
    return { type: FLIP_VERTICAL };
}

export function toggleGridSnapping() {
    return { type: TOGGLE_GRID_SNAPPING };
}

export function fileSave(data) {
    return { type: FILE_SAVE, payload: { data } };
}

export function fileOpen(data) {
    return { type: FILE_OPEN, payload: { data } };
}

export function toggleShowRulers() {
    return { type: TOGGLE_SHOW_RULER };
}

export function toggleShowGrid() {
    return { type: TOGGLE_SHOW_GRID };
}

export function toggleShowSubDivisions() {
    return { type: TOGGLE_SHOW_SUBDIVISIONS };
}

export function setRulerGrid(canvasSpecs) {
    return { type: SET_RULER_GRID, payload: canvasSpecs };
}
