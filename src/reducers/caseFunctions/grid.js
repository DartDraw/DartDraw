const minLineDistance = 10;
const pixelsPerInch = 72;
const pixelsPerCm = 72 / 2.54;

export function setGrid(stateCopy) {
    const { ruler, scale, gridPreferences, canvasWidth, canvasHeight } = stateCopy;

    stateCopy.gridLines = updateGrid(ruler, gridPreferences, scale, canvasWidth, canvasHeight);

    return stateCopy;
}

export function updateGrid(ruler, gridPreferences, scale, canvasWidth, canvasHeight) {
    var pixelsPerUnit;
    var unitBase;

    if (
        ruler.unitType === "m" ||
        ruler.unitType === "cm" ||
        ruler.unitType === "mm"
    ) {
        pixelsPerUnit = pixelsPerCm * scale;
        unitBase = 10;
    } else {
        pixelsPerUnit = pixelsPerInch * scale;
        unitBase = 2;
    }
    // 
    // const max = Math.max(canvasWidth, canvasHeight);
    //
    // var labelRender = 1;
    //
    // if ((pixelsPerUnit * scale) < minLineDistance) {
    //     labelRender = Math.ceil(minLineDistance / (pixelsPerUnit * scale));
    // }
    //
    var result = {};
    // result.divisions = [];
    // result.subDivisions = [];
    var subDivisions = pixelsPerUnit / Math.pow(unitBase, ruler.exponent);
    result.snapTo = subDivisions;
    //
    // while ((subDivisions * scale) < minLineDistance) {
    //     subDivisions = subDivisions * unitBase;
    // }
    //
    // for (var i = 0; i <= max; i += subDivisions) {
    //     if (i === 0) {
    //         continue; // don't render a gridline on 0
    //     }
    //
    //     if (i % pixelsPerUnit === 0) {
    //         if ((i / pixelsPerUnit) % labelRender === 0) {
    //             result.divisions.push(i);
    //         }
    //     } else {
    //         result.subDivisions.push(i);
    //     }
    // }
    //
    return result;
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
