import uuidv1 from 'uuid';

export function setArrowheadType(arrowheadType) {
    var arrowhead = {};

    switch (arrowheadType) {
        case 'triangle':
            arrowhead = {
                id: 'triangle',
                type: 'triangle',
                points: [175, 25, 275, 75, 175, 125],
                fillOpacity: 1
            };
            break;
        case 'barbed':
            arrowhead = {
                id: 'barbed',
                type: 'barbed',
                points: [175, 25, 275, 75, 175, 125, 200, 75],
                fillOpacity: 1
            };
            break;
        case 'ellipse':
            arrowhead = {
                id: 'ellipse',
                type: 'ellipse',
                cx: 225,
                cy: 75,
                rx: 50,
                ry: 50,
                fillOpacity: 1
            };
            break;
        case 'rectangle':
            arrowhead = {
                id: 'rectangle',
                type: 'rectangle',
                x: 175,
                y: 25,
                width: 100,
                height: 100,
                fillOpacity: 1
            };
            break;
        case 'polyline':
            arrowhead = {
                id: 'polyline',
                type: 'polyline',
                points: [175, 25, 275, 75, 175, 125],
                fillOpacity: 0
            };
            break;
        default: break;
    }

    arrowhead.handles = generateHandles(arrowhead);
    arrowhead.handles = updateHandles(arrowhead);

    return arrowhead;
}

export function reshape(arrowhead, draggableData, handleIndex) {
    const { x, y, deltaX, deltaY, node } = draggableData;

    let offsetLeft = 0;
    let offsetTop = 0;

    if (node) {
        offsetLeft = node.parentNode.getBoundingClientRect().left;
        offsetTop = node.parentNode.getBoundingClientRect().top;
    }

    let mouseX = x - offsetLeft;
    let mouseY = y - offsetTop;

    // clean up this logic

    switch (arrowhead.type) {
        case 'triangle':
        case 'polyline':
            arrowhead.points[0] = clamp(mouseX, 0, arrowhead.points[2]);
            arrowhead.points[1] = clamp(mouseY, 0, arrowhead.points[3]);
            arrowhead.points[4] = arrowhead.points[0];
            arrowhead.points[5] = node.parentNode.clientHeight - arrowhead.points[1];
            break;
        case 'barbed':
            if (handleIndex === 0) {
                arrowhead.points[0] = clamp(mouseX, 0, arrowhead.points[2]);
                arrowhead.points[1] = clamp(mouseY, 0, arrowhead.points[3]);
                arrowhead.points[4] = arrowhead.points[0];
                arrowhead.points[5] = node.parentNode.clientHeight - arrowhead.points[1];
            } else if (handleIndex === 1) {
                arrowhead.points[6] = clamp(mouseX, 0, arrowhead.points[2]);
            }
            break;
        case 'ellipse':
            if (handleIndex === 0) {
                arrowhead.rx = arrowhead.rx - deltaX / 2;
                arrowhead.cx = arrowhead.cx + deltaX / 2;
            } else if (handleIndex === 1) {
                arrowhead.ry = clamp(arrowhead.cy - mouseY, 0, node.parentNode.clientHeight / 2);
            }
            break;
        case 'rectangle':
            if (handleIndex === 0) {
                arrowhead.width = arrowhead.width - deltaX;
                arrowhead.x = mouseX;
            } else if (handleIndex === 1) {
                arrowhead.height = arrowhead.height - deltaY * 2;
                arrowhead.y = mouseY;
            }
            break;
        default:
            break;
    }

    arrowhead.handles = updateHandles(arrowhead);

    return arrowhead;
}

function generateHandles(arrowhead) {
    let numHandles;

    switch (arrowhead.type) {
        case 'barbed':
        case 'ellipse':
        case 'rectangle':
            numHandles = 2;
            break;
        case 'triangle':
        case 'polyline':
            numHandles = 1;
            break;
        default: break;
    }

    let handles = [];

    for (let i = 0; i < numHandles; i++) {
        handles.push({id: uuidv1(), index: i});
    }

    return handles;
}

export function updateHandles(arrowhead) {
    switch (arrowhead.type) {
        case 'triangle':
        case 'polyline':
            arrowhead.handles[0].x = arrowhead.points[0];
            arrowhead.handles[0].y = arrowhead.points[1];
            break;
        case 'barbed':
            arrowhead.handles[0].x = arrowhead.points[0];
            arrowhead.handles[0].y = arrowhead.points[1];
            arrowhead.handles[1].x = arrowhead.points[6];
            arrowhead.handles[1].y = arrowhead.points[7];
            break;
        case 'ellipse':
            arrowhead.handles[0].x = arrowhead.cx - arrowhead.rx;
            arrowhead.handles[0].y = arrowhead.cy;
            arrowhead.handles[1].x = arrowhead.cx;
            arrowhead.handles[1].y = arrowhead.cy - arrowhead.ry;
            break;
        case 'rectangle':
            arrowhead.handles[0].x = arrowhead.x;
            arrowhead.handles[0].y = arrowhead.y + arrowhead.height / 2;
            arrowhead.handles[1].x = arrowhead.x + arrowhead.width / 2;
            arrowhead.handles[1].y = arrowhead.y;
            break;
        default: break;
    }

    return arrowhead.handles;
}

function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}
