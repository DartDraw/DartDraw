import { updateGridRulers } from './rulers';

const minZoom = 0.125;
const maxZoom = 16;

export function zoomIn(stateCopy) {
    const scaleFactor = 2;
    const newScale = Math.min(stateCopy.scale * scaleFactor, maxZoom);

    const { panX, panY } = setPan(stateCopy, newScale);

    const { r, g } = updateGridRulers(stateCopy.ruler, stateCopy.gridPreferences, newScale, panX, panY, stateCopy.canvasWidthInPixels, stateCopy.canvasHeightInPixels);
    stateCopy.ruler = r;
    stateCopy.gridLines = g;
    stateCopy.panX = panX;
    stateCopy.panY = panY;
    stateCopy.scale = newScale;

    return stateCopy;
}

export function zoomOut(stateCopy) {
    const scaleFactor = 0.5;
    const newScale = Math.max(stateCopy.scale * scaleFactor, minZoom);

    const { panX, panY } = setPan(stateCopy, newScale);

    const { r, g } = updateGridRulers(stateCopy.ruler, stateCopy.gridPreferences, newScale, panX, panY, stateCopy.canvasWidthInPixels, stateCopy.canvasHeightInPixels);
    stateCopy.ruler = r;
    stateCopy.gridLines = g;
    stateCopy.panX = panX;
    stateCopy.panY = panY;
    stateCopy.scale = newScale;

    return stateCopy;
}

export function zoomToCustom(stateCopy, action) {
    const { customScale } = action.payload;

    var scale = clamp(customScale, minZoom, maxZoom);

    const { panX, panY } = setPan(stateCopy, scale);

    const { r, g } = updateGridRulers(stateCopy.ruler, stateCopy.gridPreferences, scale, panX, panY, stateCopy.canvasWidthInPixels, stateCopy.canvasHeightInPixels);
    stateCopy.ruler = r;
    stateCopy.gridLines = g;
    stateCopy.panX = panX;
    stateCopy.panY = panY;
    stateCopy.scale = scale;

    return stateCopy;
}

export function zoomToMarqueeBox(stateCopy) {
    const { marqueeBox, canvasWidthInPixels, canvasHeightInPixels } = stateCopy;
    // The value 45 is the width menus.
    // Needs to change if menu changes.
    const windowWidth = window.innerWidth - 45;
    const windowHeight = window.innerHeight - 45;

    const zoomRatioX = Math.abs(windowWidth / marqueeBox.width);
    const zoomRatioY = Math.abs(windowHeight / marqueeBox.height);
    const scale = clamp(Math.min(zoomRatioX, zoomRatioY), minZoom, maxZoom);

    let panX, panY;

    panX = marqueeBox.x + (marqueeBox.width / 2) - (windowWidth / 2 / scale);
    panX = clamp(panX, 0, canvasWidthInPixels - windowWidth / scale);

    panY = marqueeBox.y + (marqueeBox.height / 2) - (windowHeight / 2 / scale);
    panY = clamp(panY, 0, canvasHeightInPixels - windowHeight / scale);

    const { r, g } = updateGridRulers(stateCopy.ruler, stateCopy.gridPreferences, scale, panX, panY, stateCopy.canvasWidthInPixels, stateCopy.canvasHeightInPixels);
    return {
        ruler: r,
        gridLines: g,
        panX: panX,
        panY: panY,
        scale: scale
    };
}

export function pan(stateCopy, draggableData) {
    const { canvasWidthInPixels, canvasHeightInPixels, scale } = stateCopy;
    const { deltaX, deltaY } = draggableData;

    // The value 45 is the width menus.
    // Needs to change if menu changes.
    var panX = stateCopy.panX - deltaX / scale;
    panX = clamp(panX, 0, canvasWidthInPixels - (window.innerWidth - 45) / scale);

    var panY = stateCopy.panY - deltaY / scale;
    panY = clamp(panY, 0, canvasHeightInPixels - (window.innerHeight - 45) / scale);

    const { r, g } = updateGridRulers(stateCopy.ruler, stateCopy.gridPreferences, scale, panX, panY, stateCopy.canvasWidthInPixels, stateCopy.canvasHeightInPixels);
    return {
        ruler: r,
        gridLines: g,
        panX: panX,
        panY: panY
    };
}

function setPan(stateCopy, newScale) {
    var { canvasWidthInPixels, canvasHeightInPixels, panX, panY, scale } = stateCopy;

    // The value 45 is the width menus.
    // Needs to change if menu changes.
    const windowWidth = window.innerWidth - 45;
    const windowHeight = window.innerHeight - 45;

    // set panX
    if ((windowWidth / scale) < canvasWidthInPixels) {
        panX = panX + (windowWidth / 2 / scale) - (windowWidth / 2 / newScale);
    } else if ((windowWidth / newScale) < canvasWidthInPixels) {
        panX = panX + (canvasWidthInPixels / 2) - (windowWidth / 2 / newScale);
    }
    panX = clamp(panX, 0, canvasWidthInPixels - windowWidth / newScale);

    // set panY
    if ((windowHeight / scale) < canvasHeightInPixels) {
        panY = panY + (windowHeight / 2 / scale) - (windowHeight / 2 / newScale);
    } else if ((windowHeight / newScale) < canvasHeightInPixels) {
        panY = panY + (canvasHeightInPixels / 2) - (windowHeight / 2 / newScale);
    }
    panY = clamp(panY, 0, canvasHeightInPixels - windowHeight / newScale);

    return { panX, panY };
}

function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}
