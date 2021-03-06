// import { DartColor } from './reducers/caseFunctions';

export var DartColor = function(colorType, rgba, value, alpha) {
    this.colorType = colorType;
    this.rgba = rgba;
    this.value = value;
    this.alpha = alpha;
};

export const CONTEXTUAL_MENU_WIDTH = 220;
export const SCROLL_BAR_WIDTH = 18;

// color
export var defaultFill = new DartColor("rgb", {r: 200, g: 200, b: 200, a: 1}, [200, 200, 200], 1);
export var defaultStroke = new DartColor("rgb", {r: 100, g: 100, b: 100, a: 1}, [100, 100, 100], 1);

// menu
export const MENU_WIDTH = 45;

// zoom
export const MAX_ZOOM = 32;
export const MIN_ZOOM = 0.1;

// arrow
export const ARROW_STROKE_WIDTH = 5;

export const ARROW_GUI_WIDTH = 174;
export const ARROW_GUI_HEIGHT = 150;
export const ARROW_GUI_BUFFER = 10;

export const TRIANGLE_HEIGHT = 40;
export const TRIANGLE_LENGTH = 60;
export const BARBED_HEIGHT = 40;
export const BARBED_LENGTH = 60;
export const ELLIPSE_RX = 15;
export const ELLIPSE_RY = 15;
export const RECTANGLE_HEIGHT = 30;
export const RECTANGLE_LENGTH = 30;
export const POLYLINE_HEIGHT = 40;
export const POLYLINE_LENGTH = 60;

export const TRIANGLE_POINTS = [
    ARROW_GUI_WIDTH - ARROW_GUI_BUFFER - TRIANGLE_LENGTH,
    (ARROW_GUI_HEIGHT - TRIANGLE_HEIGHT) / 2,
    ARROW_GUI_WIDTH - ARROW_GUI_BUFFER,
    ARROW_GUI_HEIGHT / 2,
    ARROW_GUI_WIDTH - ARROW_GUI_BUFFER - TRIANGLE_LENGTH,
    (ARROW_GUI_HEIGHT + TRIANGLE_HEIGHT) / 2
];
export const BARBED_POINTS = [
    ARROW_GUI_WIDTH - ARROW_GUI_BUFFER - (1.25 * BARBED_LENGTH),
    (ARROW_GUI_HEIGHT - BARBED_HEIGHT) / 2,
    ARROW_GUI_WIDTH - ARROW_GUI_BUFFER,
    ARROW_GUI_HEIGHT / 2,
    ARROW_GUI_WIDTH - ARROW_GUI_BUFFER - (1.25 * BARBED_LENGTH),
    (ARROW_GUI_HEIGHT + BARBED_HEIGHT) / 2,
    ARROW_GUI_WIDTH - ARROW_GUI_BUFFER - BARBED_LENGTH,
    ARROW_GUI_HEIGHT / 2
];
export const ELLIPSE_POINTS = [
    ARROW_GUI_WIDTH - ARROW_GUI_BUFFER - ELLIPSE_RX,
    ARROW_GUI_HEIGHT / 2,
    ELLIPSE_RX,
    ELLIPSE_RY
];
export const RECTANGLE_POINTS = [
    ARROW_GUI_WIDTH - ARROW_GUI_BUFFER - RECTANGLE_LENGTH,
    (ARROW_GUI_HEIGHT - RECTANGLE_HEIGHT) / 2,
    RECTANGLE_LENGTH,
    RECTANGLE_HEIGHT
];
export const POLYLINE_POINTS = TRIANGLE_POINTS;
