export function zoomIn(stateCopy, action) {
    const scale = 2;
    const { panX, panY } = zoom(stateCopy, scale);
    stateCopy.panX = panX;
    stateCopy.panY = panY;
    stateCopy.scale *= scale;
    return stateCopy;
}

export function zoomOut(stateCopy, action) {
    const scale = 0.5;
    const { panX, panY } = zoom(stateCopy, scale);
    stateCopy.panX = panX;
    stateCopy.panY = panY;
    stateCopy.scale *= scale;
    return stateCopy;
}

export function zoom(stateCopy, scale) {
    let panX, panY;

    if (scale > 1) {
        var newX = 0;
        var newY = 0;
        panX = newX;
        panY = newY;
    } else {
        panX = 0;
        panY = 0;
    }

    return { panX, panY };
}

export function pan(stateCopy, draggableData) {
    const { canvasWidth, canvasHeight, scale } = stateCopy;
    const { deltaX, deltaY } = draggableData;

    if (scale > 1) {
        var panX = stateCopy.panX - deltaX / scale;
        var panY = stateCopy.panY - deltaY / scale;

        // The values 38 and 43 are the widths and heights of the menus.
        // Needs to change if menu changes.
        return {
            panX: clamp(panX, 0, canvasWidth - (window.innerWidth - 38) / scale),
            panY: clamp(panY, 0, canvasHeight - (window.innerHeight - 43) / scale)
        };
    } else {
        return { panX: stateCopy.panX, panY: stateCopy.panY };
    }
}

function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}
