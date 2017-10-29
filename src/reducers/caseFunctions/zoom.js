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

    viewBox[2] *= Math.sqrt(scale);
    viewBox[3] *= Math.sqrt(scale);
    const scaledWidth = scale < 0 ? canvasWidth / scale : canvasWidth * scale;
    const scaledHeight = scale < 0 ? canvasHeight / scale : canvasHeight * scale;

    var newX = (viewBox[0] * scale) + ((1 - scale) * scaledWidth / 2);
    var newY = (viewBox[1] * scale) + ((1 - scale) * scaledHeight / 2);

    viewBox[0] = clamp(newX, 0, scaledWidth - viewBox[2]);
    viewBox[1] = clamp(newY, 0, scaledHeight - viewBox[3]);

    return viewBox;
}

export function pan(stateCopy, viewBox, draggableData, scale) {
    const { canvasWidth, canvasHeight } = stateCopy;
    const { deltaX, deltaY } = draggableData;

    if (scale > 1) {
        var newX = viewBox[0] - deltaX / scale;
        var newY = viewBox[1] - deltaY / scale;

        const widthScale = canvasWidth / viewBox[2];
        const heightScale = canvasHeight / viewBox[3];
        const width = widthScale < 0 ? canvasWidth / widthScale : canvasWidth * widthScale;
        const height = heightScale < 0 ? canvasHeight / heightScale : canvasHeight * heightScale;
        viewBox[0] = clamp(newX, 0, width - viewBox[2]);
        viewBox[1] = clamp(newY, 0, height - viewBox[3]);
    }

    return viewBox;
}

function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}
