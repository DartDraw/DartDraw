import { updateRulers } from './rulers';
import { updateGrid } from './grid';

const minZoom = 0.125;
const maxZoom = 16;

export function zoomIn(stateCopy) {
    const scaleFactor = 2;
    const newScale = Math.min(stateCopy.scale * scaleFactor, maxZoom);

    const { panX, panY } = setPan(stateCopy, newScale);

    stateCopy.ruler = updateRulers(stateCopy.ruler, newScale, panX, panY, stateCopy.canvasWidth, stateCopy.canvasHeight);
    stateCopy.gridLines = updateGrid(stateCopy.ruler, stateCopy.gridPreferences, stateCopy.gridLines, newScale, stateCopy.canvasWidth, stateCopy.canvasHeight);

    stateCopy.panX = panX;
    stateCopy.panY = panY;
    stateCopy.scale = newScale;

    return stateCopy;
}

export function zoomOut(stateCopy) {
    const scaleFactor = 0.5;
    const newScale = Math.max(stateCopy.scale * scaleFactor, minZoom);

    const { panX, panY } = setPan(stateCopy, newScale);

    stateCopy.ruler = updateRulers(stateCopy.ruler, newScale, panX, panY, stateCopy.canvasWidth, stateCopy.canvasHeight);
    stateCopy.gridLines = updateGrid(stateCopy.ruler, stateCopy.gridPreferences, stateCopy.gridLines, newScale, stateCopy.canvasWidth, stateCopy.canvasHeight);

    stateCopy.panX = panX;
    stateCopy.panY = panY;
    stateCopy.scale = newScale;

    return stateCopy;
}

export function zoomToCustom(stateCopy, action) {
    const { customScale } = action.payload;

    var scale = clamp(customScale, minZoom, maxZoom);

    const { panX, panY } = setPan(stateCopy, scale);

    stateCopy.ruler = updateRulers(stateCopy.ruler, scale, panX, panY, stateCopy.canvasWidth, stateCopy.canvasHeight);
    stateCopy.gridLines = updateGrid(stateCopy.ruler, stateCopy.gridPreferences, stateCopy.gridLines, scale, stateCopy.canvasWidth, stateCopy.canvasHeight);

    stateCopy.panX = panX;
    stateCopy.panY = panY;
    stateCopy.scale = scale;

    return stateCopy;
}

export function zoomToMarqueeBox(stateCopy) {
    const { marqueeBox, canvasWidth, canvasHeight } = stateCopy;
    // The value 45 is the width menus.
    // Needs to change if menu changes.
    const windowWidth = window.innerWidth - 45;
    const windowHeight = window.innerHeight - 45;

    const zoomRatioX = Math.abs(windowWidth / marqueeBox.width);
    const zoomRatioY = Math.abs(windowHeight / marqueeBox.height);
    const scale = clamp(Math.min(zoomRatioX, zoomRatioY), minZoom, maxZoom);

    let panX, panY;

    panX = marqueeBox.x + (marqueeBox.width / 2) - (windowWidth / 2 / scale);
    panX = clamp(panX, 0, canvasWidth - windowWidth / scale);

    panY = marqueeBox.y + (marqueeBox.height / 2) - (windowHeight / 2 / scale);
    panY = clamp(panY, 0, canvasHeight - windowHeight / scale);

    stateCopy.ruler = updateRulers(stateCopy.ruler, scale, panX, panY, canvasWidth, canvasHeight);
    stateCopy.gridLines = updateGrid(stateCopy.ruler, stateCopy.gridPreferences, stateCopy.gridLines, scale, canvasWidth, canvasHeight);

    return {
        ruler: stateCopy.ruler,
        panX: panX,
        panY: panY,
        scale: scale
    };
}

export function pan(stateCopy, draggableData) {
    const { canvasWidth, canvasHeight, scale } = stateCopy;
    const { deltaX, deltaY } = draggableData;

    // The value 45 is the width menus.
    // Needs to change if menu changes.
    var panX = stateCopy.panX - deltaX / scale;
    panX = clamp(panX, 0, canvasWidth - (window.innerWidth - 45) / scale);

    var panY = stateCopy.panY - deltaY / scale;
    panY = clamp(panY, 0, canvasHeight - (window.innerHeight - 45) / scale);

    stateCopy.ruler = updateRulers(stateCopy.ruler, scale, panX, panY, canvasWidth, canvasHeight);

    return {
        ruler: stateCopy.ruler,
        panX: panX,
        panY: panY
    };
}

function setPan(stateCopy, newScale) {
    var { canvasWidth, canvasHeight, panX, panY, scale } = stateCopy;

    // The value 45 is the width menus.
    // Needs to change if menu changes.
    const windowWidth = window.innerWidth - 45;
    const windowHeight = window.innerHeight - 45;

    // set panX
    if ((windowWidth / scale) < canvasWidth) {
        panX = panX + (windowWidth / 2 / scale) - (windowWidth / 2 / newScale);
    } else if ((windowWidth / newScale) < canvasWidth) {
        panX = panX + (canvasWidth / 2) - (windowWidth / 2 / newScale);
    }
    panX = clamp(panX, 0, canvasWidth - windowWidth / newScale);

    // set panY
    if ((windowHeight / scale) < canvasHeight) {
        panY = panY + (windowHeight / 2 / scale) - (windowHeight / 2 / newScale);
    } else if ((windowHeight / newScale) < canvasHeight) {
        panY = panY + (canvasHeight / 2) - (windowHeight / 2 / newScale);
    }
    panY = clamp(panY, 0, canvasHeight - windowHeight / newScale);

    return { panX, panY };
}

function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}
