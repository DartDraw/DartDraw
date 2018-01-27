const minLineDistance = 10;
const minLabelDistance = 20;

export function setGrid(stateCopy) {
    const { ruler, scale, gridPreferences, canvasWidth, canvasHeight } = stateCopy;

    stateCopy.gridLines = updateGrid(ruler, gridPreferences, scale, canvasWidth, canvasHeight);

    return stateCopy;
}

export function updateGrid(ruler, gridPreferences, pixelsPerUnit, subUnitBase, subUnitExponent, scale, canvasWidth, canvasHeight) {
    const maxDimension = Math.max(canvasWidth, canvasHeight);
    const absolutePixelsPerUnit = pixelsPerUnit / scale;
    const lineSpacing = absolutePixelsPerUnit / ruler.unitDivisions;
    const lineQty = Math.ceil(maxDimension / lineSpacing);

    var result = {};
    result.divisions = [];
    result.subDivisions = [];

    for (var line = 1; line <= lineQty; line++) {
        if (line % ruler.unitDivisions === 0) {
            result.divisions.push(line * lineSpacing);
        } else {
            result.subDivisions.push(line * lineSpacing);
        }
    }

    // const max = Math.max(canvasWidth, canvasHeight);
    //
    // var labelRender = 1;
    //
    // if ((pixelsPerUnit * scale) < minLabelDistance) {
    //     labelRender = Math.ceil(minLabelDistance / (pixelsPerUnit * scale));
    // }
    //
    // var result = {};
    // result.divisions = [];
    // result.subDivisions = [];
    // var subDivisions = pixelsPerUnit / ruler.unitDivisions;
    // result.snapTo = subDivisions;
    //
    // while ((subDivisions * scale) < minLineDistance) {
    //     subDivisions = subDivisions * subUnitBase;
    // }
    //
    // if (subDivisions > pixelsPerUnit) {
    //     subDivisions = pixelsPerUnit;
    // }
    //
    // var intervals = Math.ceil(max / subDivisions);
    //
    // for (var i = 0; i <= intervals; i++) {
    //     if (i === 0) {
    //         continue; // don't render a gridline on 0
    //     }
    //
    //     if ((i * subDivisions) % pixelsPerUnit === 0) {
    //         if (((i * subDivisions) / pixelsPerUnit) % labelRender === 0) {
    //             result.divisions.push(i * subDivisions);
    //         }
    //     } else {
    //         result.subDivisions.push(i * subDivisions);
    //     }
    // }
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
