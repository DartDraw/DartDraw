import uuidv1 from 'uuid';

export function addMarqueeBox(action, panX, panY, scale) {
    const { draggableData } = action.payload;
    const { x, y, node } = draggableData;
    const marqueeBox = {
        id: uuidv1(),
        type: 'marqueeBox',
        x: (x + (panX * scale) - node.getBoundingClientRect().left) / scale,
        y: (y + (panY * scale) - node.getBoundingClientRect().top) / scale,
        width: 0,
        height: 0,
        stroke: 'rgba(102, 204, 255, 0.7)',
        strokeWidth: '2',
        strokeDasharray: '5',
        fill: 'none'
    };

    return marqueeBox;
}

export function resizeMarqueeBox(marqueeBox, draggableData, scale) {
    const { deltaX, deltaY } = draggableData;

    marqueeBox.width += deltaX / scale;
    marqueeBox.height += deltaY / scale;

    return marqueeBox;
}
