import uuidv1 from 'uuid';
//
// export function generateArrowheadPrototypes() {
//     let arrowheadPrototypes = {};
//
//     const triangle = {
//         id: "triangle",
//         type: "triangle",
//         points: [150, 25, 250, 75, 150, 125]
//     };
//     triangle.handles = generateHandles(triangle);
//     arrowheadPrototypes[triangle.id] = triangle;
//
//     const barbed = {
//         id: "barbed",
//         type: "barbed",
//         points: [175, 75, 150, 25, 250, 75, 150, 125]
//     };
//     barbed.handles = generateHandles(barbed);
//     arrowheadPrototypes[barbed.id] = barbed;
//
//     return arrowheadPrototypes;
// }

export function setArrowheadType(arrowheadType) {
    var arrowhead = {};

    switch (arrowheadType) {
        case 'triangle':
            arrowhead = {
                id: "triangle",
                type: "triangle",
                points: [150, 25, 250, 75, 150, 125]
            };
            break;
        case 'barbed':
            arrowhead = {
                id: "barbed",
                type: "barbed",
                points: [175, 75, 150, 25, 250, 75, 150, 125]
            };
            break;
        case 'circle':
            break;
        case 'square':
            break;
        case 'line':
            break;
        default: break;
    }

    arrowhead.handles = generateHandles(arrowhead);

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
        default:
            break;
    }

    arrowhead.handles = updateHandles(arrowhead);

    return arrowhead;
}

function generateHandles(arrowhead) {
    let handles = [];
    switch (arrowhead.type) {
        case "triangle" :
            if (arrowhead.points) {
                for (let i = 0; i < 2; i++) {
                    handles.push({id: uuidv1(), index: i, x: arrowhead.points[i * 2], y: arrowhead.points[i * 2 + 1]});
                }
            }
            break;
        case "barbed":
            if (arrowhead.points) {
                for (let i = 0; i < 3; i++) {
                    handles.push({id: uuidv1(), index: i, x: arrowhead.points[i * 2], y: arrowhead.points[i * 2 + 1]});
                }
            }
            break;
        default: break;
    }
    return handles;
}

function updateHandles(arrowhead) {
    // can probs consolidate this
    switch (arrowhead.type) {
        case "triangle" :
            if (arrowhead.points) {
                for (let i = 0; i < 2; i++) {
                    arrowhead.handles[i].x = arrowhead.points[i * 2];
                    arrowhead.handles[i].y = arrowhead.points[i * 2 + 1];
                }
            }
            break;
        case "barbed":
            if (arrowhead.points) {
                for (let i = 0; i < 3; i++) {
                    arrowhead.handles[i].x = arrowhead.points[i * 2];
                    arrowhead.handles[i].y = arrowhead.points[i * 2 + 1];
                }
            }
            break;
        default: break;
    }
    return arrowhead.handles;
}

function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}
