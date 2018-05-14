// import { DartColor } from './reducers/caseFunctions';

export var DartColor = function(colorType, rgba, value, alpha) {
    this.colorType = colorType;
    this.rgba = rgba;
    this.value = value;
    this.alpha = alpha;
};

export const CONTEXTUAL_MENU_WIDTH = 220;
export const SCROLL_BAR_WIDTH = 18;

export var defaultFill = new DartColor("rgb", {r: 200, g: 200, b: 200, a: 1}, [200, 200, 200], 1);
export var defaultStroke = new DartColor("rgb", {r: 100, g: 100, b: 100, a: 1}, [100, 100, 100], 1);

export const GRID_PALETTE = [{r: 0, g: 0, b: 0, a: 1}, {r: 51, g: 51, b: 51, a: 1}, {r: 102, g: 102, b: 102, a: 1}, {r: 140, g: 140, b: 140, a: 1}, {r: 179, g: 179, b: 179, a: 1}, {r: 204, g: 204, b: 204, a: 1}, {r: 255, g: 255, b: 255, a: 1}, {r: 153, g: 0, b: 0, a: 1},
    {r: 204, g: 0, b: 0, a: 1},
    {r: 255, g: 0, b: 0, a: 1},
    {r: 255, g: 51, b: 51, a: 1},
    {r: 255, g: 102, b: 102, a: 1},
    {r: 255, g: 153, b: 153, a: 1},
    {r: 255, g: 204, b: 204, a: 1},
    {r: 153, g: 61, b: 0, a: 1},
    {r: 204, g: 82, b: 0, a: 1},
    {r: 255, g: 102, b: 0, a: 1},
    {r: 255, g: 133, b: 51, a: 1},
    {r: 255, g: 163, b: 102, a: 1},
    {r: 255, g: 194, b: 153, a: 1},
    {r: 255, g: 224, b: 204, a: 1},
    {r: 153, g: 153, b: 0, a: 1},
    {r: 204, g: 204, b: 0, a: 1},
    {r: 255, g: 255, b: 0, a: 1},
    {r: 255, g: 255, b: 51, a: 1},
    {r: 255, g: 255, b: 102, a: 1},
    {r: 255, g: 255, b: 153, a: 1},
    {r: 255, g: 255, b: 204, a: 1},
    {r: 0, g: 153, b: 38, a: 1},
    {r: 0, g: 204, b: 51, a: 1},
    {r: 0, g: 255, b: 64, a: 1},
    {r: 51, g: 255, b: 102, a: 1},
    {r: 102, g: 255, b: 140, a: 1},
    {r: 153, g: 255, b: 179, a: 1},
    {r: 204, g: 255, b: 217, a: 1},

    {g: 0, b: 153, r: 38, a: 1},
    {g: 0, b: 204, r: 51, a: 1},
    {g: 0, b: 255, r: 64, a: 1},
    {g: 51, b: 255, r: 102, a: 1},
    {g: 102, b: 255, r: 140, a: 1},
    {g: 153, b: 255, r: 179, a: 1},
    {g: 204, b: 255, r: 217, a: 1} ];

// default palette:
// [{r: 255, g: 255, b: 255, a: 1}, {r: 244, g: 67, b: 54, a: 1}, {r: 233, g: 30, b: 99, a: 1},
//     {r: 103, g: 58, b: 183, a: 1}, {r: 33, g: 150, b: 243, a: 1}, {r: 76, g: 175, b: 80, a: 1},
//     {r: 255, g: 235, b: 59, a: 1}, {r: 255, g: 152, b: 0, a: 1}, {r: 121, g: 85, b: 72, a: 1},
//     {r: 0, g: 0, b: 0, a: 1}]
