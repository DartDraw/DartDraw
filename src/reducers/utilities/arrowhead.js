import uuidv1 from 'uuid';

export function setArrowheadType(arrowheadType) {
    var arrowhead = {};

    switch (arrowheadType) {
        case 'triangle':
            arrowhead = {
                id: 'triangle',
                type: 'triangle',
                points: [100, 25, 200, 75, 100, 125],
                fillOpacity: 1
            };
            break;
        case 'barbed':
            arrowhead = {
                id: 'barbed',
                type: 'barbed',
                points: [125, 75, 100, 25, 200, 75, 100, 125],
                fillOpacity: 1
            };
            break;
        case 'ellipse':
            arrowhead = {
                id: 'ellipse',
                type: 'ellipse',
                cx: 150,
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
                x: 100,
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
                points: [100, 25, 200, 75, 100, 125],
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
    const { x, y, node } = draggableData;

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
            if (handleIndex === 0) {
                arrowhead.points[0] = clamp(mouseX, 0, arrowhead.points[2]);
                arrowhead.points[1] = clamp(mouseY, 0, arrowhead.points[3]);
                arrowhead.points[4] = arrowhead.points[0];
                arrowhead.points[5] = node.parentNode.clientHeight - arrowhead.points[1];
            } else if (handleIndex === 1) {
                arrowhead.points[handleIndex * 2] = clamp(mouseX, arrowhead.points[0], node.parentNode.clientWidth);
            }
            break;
        case 'barbed':
            if (handleIndex === 0) {
                arrowhead.points[handleIndex * 2] = clamp(mouseX, 0, arrowhead.points[4]);
            } else if (handleIndex === 1) {
                arrowhead.points[2] = clamp(mouseX, 0, node.parentNode.clientWidth);
                arrowhead.points[3] = clamp(mouseY, 0, node.parentNode.clientHeight / 2);
                arrowhead.points[6] = arrowhead.points[2];
                arrowhead.points[7] = node.parentNode.clientHeight - arrowhead.points[3];
            } else if (handleIndex === 2) {
                arrowhead.points[handleIndex * 2] = clamp(mouseX, arrowhead.points[0], node.parentNode.clientWidth);
            }
            break;
        case 'ellipse':
            if (handleIndex === 0) {
                arrowhead.ry = clamp(arrowhead.cy - mouseY, 0, node.parentNode.clientHeight / 2);
            } else if (handleIndex === 1) {
                arrowhead.rx = clamp(mouseX - arrowhead.cx, 0, node.parentNode.clientWidth / 2);
            }
            break;
        case 'rectangle':
            const cx = arrowhead.x + arrowhead.width / 2;
            const cy = arrowhead.y + arrowhead.height / 2;
            arrowhead.x = clamp(mouseX, 0, cx);
            arrowhead.y = clamp(mouseY, 0, cy);
            arrowhead.width = 2 * Math.abs(cx - arrowhead.x);
            arrowhead.height = 2 * Math.abs(cy - arrowhead.y);
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
            numHandles = 3;
            break;
        case 'triangle':
        case 'polyline':
        case 'ellipse':
            numHandles = 2;
            break;
        case 'rectangle':
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
            if (arrowhead.points) {
                for (let i = 0; i < 2; i++) {
                    arrowhead.handles[i].x = arrowhead.points[i * 2];
                    arrowhead.handles[i].y = arrowhead.points[i * 2 + 1];
                }
            }
            break;
        case 'barbed':
            if (arrowhead.points) {
                for (let i = 0; i < 3; i++) {
                    arrowhead.handles[i].x = arrowhead.points[i * 2];
                    arrowhead.handles[i].y = arrowhead.points[i * 2 + 1];
                }
            }
            break;
        case 'ellipse':
            arrowhead.handles[0].x = arrowhead.cx;
            arrowhead.handles[0].y = arrowhead.cy - arrowhead.ry;
            arrowhead.handles[1].x = arrowhead.cx + arrowhead.rx;
            arrowhead.handles[1].y = arrowhead.cy;
            break;
        case 'rectangle':
            arrowhead.handles[0].x = arrowhead.x;
            arrowhead.handles[0].y = arrowhead.y;
            break;
        default: break;
    }

    return arrowhead.handles;
}

function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}
