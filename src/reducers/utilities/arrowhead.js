import uuidv1 from 'uuid';

export function generateArrowheadPrototypes() {
    const triangle = {
        id: uuidv1(),
        type: "triangle",
        points: [150, 25, 250, 75, 150, 125]
    };
    triangle.handles = generateHandles(triangle);

    const barbed = {
        id: uuidv1(),
        type: "barbed",
        points: [150, 25, 250, 75, 150, 125, 175, 75]
    };
    barbed.handles = generateHandles(barbed);

    return [triangle, barbed];
}

function generateHandles(arrowhead) {
    let handles = [];
    if (arrowhead.points) {
        for (let i = 0; i < arrowhead.points.length / 2; i++) {
            handles.push({id: uuidv1(), index: i, x: arrowhead.points[i * 2], y: arrowhead.points[i * 2 + 1]});
        }
    }
    return handles;
}
