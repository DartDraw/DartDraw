import { updateRulerGrid } from './rulers';

export function setCustomZoom(stateCopy, action) {
    const { customScale } = action.payload;

    var scale = constrainScale(customScale);

    const { panX, panY } = setPan(stateCopy, scale);

    stateCopy.ruler = updateRulerGrid(stateCopy, scale, panX, panY);
    stateCopy.panX = panX;
    stateCopy.panY = panY;
    stateCopy.scale = scale;

    return stateCopy;
}

export function zoomToMarqueeBox(stateCopy) {
    const { marqueeBox, canvasWidth, canvasHeight } = stateCopy;
    // The value 45 is the width menus.
    // Needs to change if menu changes.
    const windowWidth = window.innerWidth - stateCopy.ruler.width - 45;
    const windowHeight = window.innerHeight - stateCopy.ruler.width - 45;

    const zoomRatioX = Math.abs(windowWidth / marqueeBox.width);
    const zoomRatioY = Math.abs(windowHeight / marqueeBox.height);
    const scale = constrainScale(Math.min(zoomRatioX, zoomRatioY));

    let panX, panY;

    panX = marqueeBox.x + (marqueeBox.width / 2) - (windowWidth / 2 / scale);
    panX = clamp(panX, 0, canvasWidth - windowWidth / scale);

    panY = marqueeBox.y + (marqueeBox.height / 2) - (windowHeight / 2 / scale);
    panY = clamp(panY, 0, canvasHeight - windowHeight / scale);

    const ruler = updateRulerGrid(stateCopy, scale, panX, panY);

    return {
        ruler: ruler,
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
    panX = clamp(panX, 0, canvasWidth - (window.innerWidth - stateCopy.ruler.width - 45) / scale);

    var panY = stateCopy.panY - deltaY / scale;
    panY = clamp(panY, 0, canvasHeight - (window.innerHeight - stateCopy.ruler.width - 45) / scale);

    const ruler = updateRulerGrid(stateCopy, scale, panX, panY);

    return {
        ruler: ruler,
        panX: panX,
        panY: panY
    };
}

export function setPan(stateCopy, newScale) {
    var { canvasWidth, canvasHeight, panX, panY, scale } = stateCopy;

    // The value 45 is the width menus.
    // Needs to change if menu changes.
    const windowWidth = window.innerWidth - stateCopy.ruler.width - 45;
    const windowHeight = window.innerHeight - stateCopy.ruler.width - 45;

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

function constrainScale(scale) {
    const minZoom = 0.1;
    const maxZoom = 32;

    if (scale > maxZoom) {
        scale = maxZoom;
        console.error("Maximum zoom level reached.");
    } else if (scale < minZoom) {
        scale = minZoom;
        console.error("Minimum zoom level reached.");
    }

    return scale;
}

function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}
