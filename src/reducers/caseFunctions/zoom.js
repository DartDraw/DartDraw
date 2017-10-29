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
    const { canvasWidth, canvasHeight } = stateCopy;
    let panX, panY;

    if (scale > 1) {
        var newX = canvasWidth / 2 - canvasWidth / 4;
        var newY = canvasHeight / 2 - canvasHeight / 4;
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

    if (true) {
        var panX = stateCopy.panX - deltaX / scale;
        var panY = stateCopy.panY - deltaY / scale;

        return { panX, panY };
    } else {
        return { panX: stateCopy.panX, panY: stateCopy.panY };
    }
}

function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}
