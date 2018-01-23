const pixelsPerInch = 72;
const minLineDistance = 20;

export function setGrid(stateCopy) {
    const { ruler, scale, gridLines, gridPreferences, canvasWidth, canvasHeight } = stateCopy;

    stateCopy.gridLines = updateGrid(ruler, gridPreferences, gridLines, scale, canvasWidth, canvasHeight);

    return stateCopy;
}

export function updateGrid(ruler, gridPreferences, gridLines, scale, canvasWidth, canvasHeight) {
    const pixelsPerUnit = pixelsPerInch;
    const max = Math.max(canvasWidth, canvasHeight);
    const divisions = pixelsPerUnit;
    var labelRender = 1;

    if ((divisions * scale) < 20) {
        labelRender = Math.ceil(20 / (divisions * scale));
    }

    gridLines.divisions = [];
    gridLines.subDivisions = [];
    gridLines.snapTo = pixelsPerUnit / Math.pow(ruler.base, ruler.exponent);
    var subDivisions = gridLines.snapTo;

    while ((subDivisions * scale) < minLineDistance) {
        subDivisions = subDivisions * ruler.base;
    }

    for (var i = 0; i <= max; i += subDivisions) {
        if (i === 0) {
            continue; // don't render a gridline on 0
        }

        if (i % divisions === 0) {
            if ((i / divisions) % labelRender === 0) {
                gridLines.divisions.push(i);
            }
        } else {
            gridLines.subDivisions.push(i);
        }
    }

    return gridLines;
}

export function toggleGridSnapping(stateCopy) {
    stateCopy.gridSnapping = !stateCopy.gridSnapping;
    return stateCopy;
}

export function toggleShowGrid(stateCopy) {
    stateCopy.gridPreferences.showGrid = !stateCopy.gridPreferences.showGrid;
    return stateCopy;
}

export function toggleShowSubDivisions(stateCopy) {
    stateCopy.gridPreferences.showSubDivisions = !stateCopy.gridPreferences.showSubDivisions;
    return stateCopy;
}
