import { minSubUnitDistance } from './rulers';

export function buildGrid(ruler, pixelsPerUnit, scale, subUnitBase, subUnitExponent, minWholeUnitDistance, canvasWidthInPixels, canvasHeightInPixels) {
    const gridDimensionInUnits = Math.ceil(Math.max(canvasWidthInPixels, canvasHeightInPixels) / pixelsPerUnit);
    var masterLineIndex = [];
    var result = {};

    result.divisions = [];
    result.subDivisions = [];
    result.snapTo = pixelsPerUnit / ruler.unitDivisions;

    // loop thru each desired level of lines, inches, halves, quarters, etc...
    for (var exponentIndex = 0; exponentIndex <= subUnitExponent; exponentIndex++) {
        const linesPerUnit = Math.pow(subUnitBase, exponentIndex);
        const lineQty = gridDimensionInUnits * linesPerUnit;
        const lineSpacing = pixelsPerUnit / linesPerUnit;
        var labelRender = 1;

        if (exponentIndex === 0 && (lineSpacing * scale) < minWholeUnitDistance) {
            labelRender = Math.ceil(minWholeUnitDistance / (lineSpacing * scale));
        }

        for (var i = 0; i <= lineQty; i++) {
            var lineLoc = lineSpacing * i;

            // if line location has already been rendered, skip it
            if (masterLineIndex.indexOf(lineLoc) !== -1) {
                continue;
            }

            masterLineIndex.push(lineLoc);

            // if is a primary line, it needs a label
            if (exponentIndex === 0) {
                if (i % labelRender === 0) {
                    result.divisions.push(lineLoc);
                }
                // else: do nothing
            } else if ((lineSpacing * scale) >= minSubUnitDistance) {
                result.subDivisions.push(lineLoc);
            }
        }
    }
    return result;

    // const maxDimension = Math.max(canvasWidthInPixels, canvasHeightInPixels);
    // var lineSpacing = pixelsPerUnit / scale / ruler.unitDivisions;
    //
    // var result = {};
    // result.divisions = [];
    // result.subDivisions = [];
    //
    // const labelRender = Math.ceil(minWholeUnitDistance / pixelsPerUnit);
    // var i = 0;
    //
    // while (((lineSpacing * scale) < minSubUnitDistance) && lineSpacing) {
    //     lineSpacing = lineSpacing * subUnitBase;
    // }
    //
    // const lineQty = Math.ceil(maxDimension / lineSpacing);
    //
    // for (var line = 0; line <= lineQty; line++) {
    //     if (line % ruler.unitDivisions === 0) {
    //         if (i === labelRender) {
    //             result.divisions.push(line * lineSpacing);
    //             i = 0;
    //         }
    //         i++;
    //     } else {
    //         result.subDivisions.push(line * lineSpacing);
    //     }
    // }
    //
    // return result;
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
