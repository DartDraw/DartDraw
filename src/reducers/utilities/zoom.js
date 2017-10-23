import uuidv1 from 'uuid';

export function zoomIn(stateCopy, action) {
    const scale = 2; // zoom in by factor of 2
    stateCopy.canvasTransformationMatrix = zoom(stateCopy, scale);
    return stateCopy;
}

export function zoomOut(stateCopy, action) {
    const scale = 0.5; // zoom out by factor of 2
    stateCopy.canvasTransformationMatrix = zoom(stateCopy, scale);
    return stateCopy;
}

export function zoom(stateCopy, scale) {
    const m = stateCopy.canvasTransformationMatrix;
    const len = m.length;
    for (let i = 0; i < len; i++) {
        m[i] *= scale;
    }
    m[4] += (1 - scale) * stateCopy.canvasWidth / 2;
    m[5] += (1 - scale) * stateCopy.canvasHeight / 2;

    return m;
}

export function zoomTo(zoomShape, canvasWidth, canvasHeight) {
    const scale = Math.min(Math.abs(canvasWidth / zoomShape.width), Math.abs(canvasHeight / zoomShape.height));
    const matrix = [];

    matrix[0] = scale;
    matrix[1] = 0;
    matrix[2] = 0;
    matrix[3] = scale;
    matrix[4] = (canvasWidth / 2) - (scale * (zoomShape.x + (zoomShape.width / 2)));
    matrix[5] = (canvasHeight / 2) - (scale * (zoomShape.y + (zoomShape.height / 2)));

    return matrix;
}

export function pan(matrix, draggableData) {
    const { deltaX, deltaY } = draggableData;
    const m = matrix;
    m[4] += deltaX;
    m[5] += deltaY;
    return m;
}

export function addZoomShape(zoomShape, action, matrix) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;

    const rectangle = {
        id: uuidv1(),
        type: 'zoomShape',
        x: (x - node.getBoundingClientRect().left - matrix[4]) / matrix[0],
        y: (y - node.getBoundingClientRect().top - matrix[5]) / matrix[3],
        width: 0,
        height: 0,
        stroke: 'rgba(102, 204, 255, 0.7)',
        fill: 'none'
    };

    return rectangle;
}

export function resizeZoomShape(zoomShape, draggableData, matrix) {
    const { deltaX, deltaY } = draggableData;

    zoomShape.width += deltaX / matrix[0];
    zoomShape.height += deltaY / matrix[3];

    return zoomShape;
}
