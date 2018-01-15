// import { updateRuler } from './rulers';

export function zoomIn(stateCopy) {
    const scaleFactor = 2;
    const newScale = stateCopy.scale * scaleFactor;

    const { panX, panY } = setPan(stateCopy, newScale);

    stateCopy.panX = panX;
    stateCopy.panY = panY;
    stateCopy.scale = newScale;

    // stateCopy = updateRuler(stateCopy);

    return stateCopy;
}

export function zoomOut(stateCopy) {
    const scaleFactor = 0.5;
    const newScale = stateCopy.scale * scaleFactor;

    const { panX, panY } = setPan(stateCopy, newScale);

    stateCopy.panX = panX;
    stateCopy.panY = panY;
    stateCopy.scale = newScale;

    return stateCopy;
}

export function zoomToCustom(stateCopy, action) {
    const { customScale } = action.payload;

    const { panX, panY } = setPan(stateCopy, customScale);

    stateCopy.panX = panX;
    stateCopy.panY = panY;
    stateCopy.scale = customScale;

    return stateCopy;
}

export function zoomToMarqueeBox(marqueeBox, canvasWidth, canvasHeight) {
    // The values 38 and 43 are the widths and heights of the menus.
    // Needs to change if menu changes.
    const windowWidth = window.innerWidth - 38 - 30;
    const windowHeight = window.innerHeight - 43 - 30;

    const zoomRatioX = Math.abs(windowWidth / marqueeBox.width);
    const zoomRatioY = Math.abs(windowHeight / marqueeBox.height);
    const scale = Math.min(zoomRatioX, zoomRatioY);

    let panX, panY;

    panX = marqueeBox.x + (marqueeBox.width / 2) - (windowWidth / 2 / scale);
    panY = marqueeBox.y + (marqueeBox.height / 2) - (windowHeight / 2 / scale);

    return {
        panX: clamp(panX, 0, canvasWidth - windowWidth / scale),
        panY: clamp(panY, 0, canvasHeight - windowHeight / scale),
        scale: scale
    };
}

export function pan(stateCopy, draggableData) {
    const { canvasWidth, canvasHeight, scale } = stateCopy;
    const { deltaX, deltaY } = draggableData;

    // The values 38 and 43 are the widths and heights of the menus.
    // Needs to change if menu changes.
    var panX = stateCopy.panX - deltaX / scale;
    var panY = stateCopy.panY - deltaY / scale;

    return {
        panX: clamp(panX, 0, canvasWidth - (window.innerWidth - 38 - 30) / scale),
        panY: clamp(panY, 0, canvasHeight - (window.innerHeight - 43 - 30) / scale)
    };
}

function setPan(stateCopy, newScale) {
    var { canvasWidth, canvasHeight, panX, panY, scale } = stateCopy;

    // The values 38 and 43 are the widths and heights of the menus.
    // Needs to change if menu changes.
    const windowWidth = window.innerWidth - 38 - 30;
    const windowHeight = window.innerHeight - 43 - 30;

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
