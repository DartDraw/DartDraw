export function zoomIn(stateCopy, action) {
    const scaleFactor = 2;
    const { panX, panY, newScale } = zoom(stateCopy, scaleFactor);
    stateCopy.panX = panX;
    stateCopy.panY = panY;
    stateCopy.scale = newScale;
    return stateCopy;
}

export function zoomOut(stateCopy, action) {
    const scaleFactor = 0.5;
    const { panX, panY, newScale } = zoom(stateCopy, scaleFactor);
    stateCopy.panX = panX;
    stateCopy.panY = panY;
    stateCopy.scale = newScale;
    return stateCopy;
}

export function zoom(stateCopy, scaleFactor) {
    var { canvasWidth, canvasHeight, panX, panY, scale } = stateCopy;

    // The values 38 and 43 are the widths and heights of the menus.
    // Needs to change if menu changes.
    const windowWidth = window.innerWidth - 38;
    const windowHeight = window.innerHeight - 43;

    const newScale = scale * scaleFactor;

    // set panX
    if ((windowWidth / scale) < canvasWidth) {
        panX = panX + (windowWidth / 2 / scale) - (windowWidth / 2 / newScale);
        panX = clamp(panX, 0, canvasWidth - windowWidth / newScale);
    }

    // set panY
    if ((windowHeight / scale) < canvasHeight) {
        panY = panY + (windowHeight / 2 / scale) - (windowHeight / 2 / newScale);
        panY = clamp(panY, 0, canvasHeight - windowHeight / newScale);
    }

    return { panX, panY, newScale };
}

export function zoomToMarqueeBox(marqueeBox, canvasWidth, canvasHeight) {
    // The values 38 and 43 are the widths and heights of the menus.
    // Needs to change if menu changes.
    const windowWidth = window.innerWidth - 38;
    const windowHeight = window.innerHeight - 43;
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
        panX: clamp(panX, 0, canvasWidth - (window.innerWidth - 38) / scale),
        panY: clamp(panY, 0, canvasHeight - (window.innerHeight - 43) / scale)
    };
}

function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}
