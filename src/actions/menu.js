export const EDIT_SHAPE = 'EDIT_SHAPE';
export const EDIT_TEXT = 'EDIT_TEXT';
export const KEY_DOWN = 'KEY_DOWN';
export const KEY_UP = 'KEY_UP';
export const MOUSE_MOVE = 'MOUSE_MOVE';
export const SELECT_TOOL = 'SELECT_TOOL';
export const EXPORT_CLICK = 'EXPORT_CLICK';
export const SELECT_COLOR = 'SELECT_COLOR';
export const SELECT_PALETTE = 'SELECT_PALETTE';
export const ADD_COLOR = 'ADD_COLOR';
export const REMOVE_COLOR = 'REMOVE_COLOR';
export const ADD_PALETTE = 'ADD_PALETTE';
export const REMOVE_PALETTE = 'REMOVE_PALETTE';
export const UNDO_CLICK = 'UNDO_CLICK';
export const REDO_CLICK = 'REDO_CLICK';
export const SET_CUSTOM_ZOOM = 'SET_CUSTOM_ZOOM';
export const DISTRIBUTE_CLICK = 'DISTRIBUTE_CLICK';
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
export const UPDATE_OPACITY = 'UPDATE_OPACITY';
export const COLOR_UPDATE = 'COLOR_UPDATE';
export const TOGGLE_SHOW_GRID = 'TOGGLE_SHOW_GRID';
export const TOGGLE_SHOW_RULER = 'TOGGLE_SHOW_RULER';
export const TOGGLE_SHOW_SUBDIVISIONS = 'TOGGLE_SHOW_SUBDIVISIONS';
export const SET_RULER_GRID = 'SET_RULER_GRID';
export const ARROW_HANDLE_DRAG = 'ARROW_HANDLE_DRAG';
export const CHANGE_ARROW_TYPE = 'CHANGE_ARROW_TYPE';
export const TOGGLE_ARROW_ASPECT = 'TOGGLE_ARROW_ASPECT';
export const TOGGLE_ARROW_SHOWN = 'TOGGLE_ARROW_SHOWN';
export const CHANGE_ARROW_HEIGHT = 'CHANGE_ARROW_HEIGHT';
export const CHANGE_ARROW_LENGTH = 'CHANGE_ARROW_LENGTH';
export const CHANGE_ARROW_BARB_LENGTH = 'CHANGE_ARROW_BARB_LENGTH';
export const CHANGE_ARROW_RADIUS_X = 'CHANGE_ARROW_RADIUS_X';
export const CHANGE_ARROW_RADIUS_Y = 'CHANGE_ARROW_RADIUS_Y';
export const SELECT_ARROW_PRESET = 'SELECT_ARROW_PRESET';
export const ADD_ARROW_PRESET = 'ADD_ARROW_PRESET';
export const SAVE_ARROW_PRESET = 'SAVE_ARROW_PRESET';
export const DELETE_ARROW_PRESET = 'DELETE_ARROW_PRESET';
export const CHANGE_COLOR_TYPE = 'CHANGE_COLOR_TYPE';
export const SELECT_RULER = 'SELECT_RULER';
export const ADD_RULER = 'ADD_RULER';
export const SAVE_RULER = 'SAVE_RULER';
export const DELETE_RULER = 'DELETE_RULER';
export const TOGGLE_RULER = 'TOGGLE_RULER';
export const RESIZE_SHAPE_TO = 'RESIZE_SHAPE_TO';
export const MOVE_SHAPE_TO = 'MOVE_SHAPE_TO';
export const ROTATE_SHAPE_TO = 'ROTATE_SHAPE_TO';
export const TOGGLE_CONTEXTUAL_MENU = 'TOGGLE_CONTEXTUAL_MENU';
export const FILE_SAVE = 'FILE_SAVE';
export const FILE_OPEN = 'FILE_OPEN';
export const TOGGLE_SETTINGS_MODAL = 'TOGGLE_SETTINGS_MODAL';

export function editShape(shape) {
    return { type: EDIT_SHAPE, payload: { shape } };
}

export function toggleSettingsModal() {
    return { type: TOGGLE_SETTINGS_MODAL };
}

export function editText(shape) {
    return { type: EDIT_TEXT, payload: { shape } };
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

export function selectPalette(paletteName) {
    return { type: SELECT_PALETTE, payload: { paletteName } };
}

export function addColor(color) {
    return { type: ADD_COLOR, payload: { color } };
}

export function removeColor(color) {
    return { type: REMOVE_COLOR, payload: { color } };
}

export function addPalette(paletteName) {
    return { type: ADD_PALETTE, payload: { paletteName } };
}

export function removePalette(paletteName) {
    return { type: REMOVE_PALETTE, payload: { paletteName } };
}

export function changeColorType(colorType) {
    return { type: CHANGE_COLOR_TYPE, payload: { colorType } };
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

export function updateOpacity(opacity) {
    return { type: UPDATE_OPACITY, payload: { opacity } };
}

export function colorUpdate(colorPart, newValue) {
    return {type: COLOR_UPDATE, payload: {colorPart, newValue}};
}

export function distributeClick(id) {
    return { type: DISTRIBUTE_CLICK, payload: { id } };
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

export function resizeShapeTo(width, height) {
    return { type: RESIZE_SHAPE_TO, payload: {width, height} };
}

export function moveShapeTo(x, y) {
    return { type: MOVE_SHAPE_TO, payload: {x, y} };
}

export function rotateShapeTo(degree) {
    return { type: ROTATE_SHAPE_TO, payload: {degree} };
}

export function selectRuler(rulerName) {
    return { type: SELECT_RULER, payload: { rulerName } };
}

export function addRuler(rulerSpecs) {
    return { type: ADD_RULER, payload: rulerSpecs };
}

export function saveRuler(rulerSpecs) {
    return { type: SAVE_RULER, payload: rulerSpecs };
}

export function deleteRuler() {
    return { type: DELETE_RULER };
}

export function toggleRuler(forward) {
    return { type: TOGGLE_RULER, payload: { forward } };
}

export function toggleContextualMenu() {
    return { type: TOGGLE_CONTEXTUAL_MENU };
}

export function arrowHandleDrag(shapeId, handleIndex, draggableData) {
    return { type: ARROW_HANDLE_DRAG, payload: { shapeId, handleIndex, draggableData } };
}

export function toggleArrowAspect() {
    return { type: TOGGLE_ARROW_ASPECT };
}

export function toggleArrowShown(mode) {
    return { type: TOGGLE_ARROW_SHOWN, payload: { mode } };
}

export function changeArrowHeight(height) {
    return { type: CHANGE_ARROW_HEIGHT, payload: { height } };
}

export function changearrowHeadLength(length) {
    return { type: CHANGE_ARROW_LENGTH, payload: { length } };
}

export function changeArrowBarbLength(length) {
    return { type: CHANGE_ARROW_BARB_LENGTH, payload: { length } };
}

export function changeArrowRadiusX(rx) {
    return { type: CHANGE_ARROW_RADIUS_X, payload: { rx } };
}

export function changeArrowRadiusY(ry) {
    return { type: CHANGE_ARROW_RADIUS_Y, payload: { ry } };
}

export function selectArrowPreset(name) {
    return { type: SELECT_ARROW_PRESET, payload: { name } };
}

export function addArrowPreset(name, arrow) {
    return { type: ADD_ARROW_PRESET, payload: { name, arrow } };
}

export function saveArrowPreset(arrow) {
    return { type: SAVE_ARROW_PRESET, payload: { arrow } };
}

export function deleteArrowPreset(presetName) {
    return { type: DELETE_ARROW_PRESET, payload: { presetName } };
}
