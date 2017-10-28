export function zoomIn(stateCopy, action) {
    const scale = 0.5;
    stateCopy.viewBox = zoom(stateCopy, scale);
    return stateCopy;
}

export function zoomOut(stateCopy, action) {
    const scale = 2;
    stateCopy.viewBox = zoom(stateCopy, scale);
    return stateCopy;
}

export function zoom(stateCopy, scale) {
    var { viewBox, canvasWidth, canvasHeight } = stateCopy;

    viewBox[2] *= scale;
    viewBox[3] *= scale;

    var newX = (viewBox[0] * scale) + ((1 - scale) * canvasWidth / 2);
    var newY = (viewBox[1] * scale) + ((1 - scale) * canvasHeight / 2);

    viewBox[0] = clamp(newX, 0, canvasWidth - viewBox[2]);
    viewBox[1] = clamp(newY, 0, canvasHeight - viewBox[3]);

    return viewBox;
}

export function pan(stateCopy, viewBox, draggableData, scale) {
    const { deltaX, deltaY } = draggableData;

    if (scale > 1) {
        var newX = viewBox[0] - deltaX / scale;
        var newY = viewBox[1] - deltaY / scale;

        viewBox[0] = clamp(newX, 0, stateCopy.canvasWidth - viewBox[2]);
        viewBox[1] = clamp(newY, 0, stateCopy.canvasHeight - viewBox[3]);
    }

    return viewBox;
}

function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}
