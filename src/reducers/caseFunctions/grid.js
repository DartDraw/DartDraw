export function updateGrid(stateCopy) {
    const { ruler } = stateCopy;

    stateCopy.gridLines.divisions = [];
    stateCopy.gridLines.subDivisions = [];

    var pixelsPerUnit = 72;
    var divisions = pixelsPerUnit;
    var subDivisions = pixelsPerUnit / Math.pow(ruler.base, ruler.exponent);

    for (var i = 0; i < stateCopy.canvasWidth; i += subDivisions) {
        if (i % divisions === 0) {
            stateCopy.gridLines.divisions.push(i);
        } else {
            stateCopy.gridLines.subDivisions.push(i);
        }
    }

    return stateCopy;
}

export function toggleGridSnapping(stateCopy) {
    stateCopy.gridSnapping = !stateCopy.gridSnapping;
    return stateCopy;
}
