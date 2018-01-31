import { minSubUnitDistance } from './rulers';

export function buildGrid(ruler, scale, subUnitBase, subUnitExponent, minWholeUnitDistance, canvasWidth, canvasHeight) {
    const gridDimensionInUnits = Math.ceil(Math.max(canvasWidth, canvasHeight) / ruler.pixelsPerUnit);
    var masterLineIndex = [];
    var result = {};
    var renderSubDivisions = true;

    result.divisions = [];
    result.subDivisions = [];
    result.gridSnapInterval = ruler.pixelsPerUnit / ruler.unitDivisions;

    // loop thru each desired level of lines, inches, halves, quarters, etc...
    for (var exponentIndex = 0; exponentIndex <= subUnitExponent; exponentIndex++) {
        const linesPerUnit = Math.pow(subUnitBase, exponentIndex);
        const lineQty = gridDimensionInUnits * linesPerUnit;
        const lineSpacing = ruler.pixelsPerUnit / linesPerUnit;
        var labelInterval = 1;
        const intervalArray = [2, 2.5, 5, 10];

        if (exponentIndex === 0 && (lineSpacing * scale) < minWholeUnitDistance) {
            labelInterval = Math.ceil(minWholeUnitDistance / (lineSpacing * scale));
            var scalingFactor = 1;

            while (labelInterval > intervalArray[intervalArray.length - 1] * scalingFactor) {
                scalingFactor *= 10;
            }

            for (let i = 0; i < intervalArray.length; i++) {
                if (labelInterval < (intervalArray[i] * scalingFactor)) {
                    labelInterval = intervalArray[i] * scalingFactor;
                    break;
                }
            }

            if (labelInterval > 1) {
                renderSubDivisions = false;
            }
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
                if (i % labelInterval === 0) {
                    result.divisions.push(lineLoc);
                } else if (!renderSubDivisions) {
                    result.subDivisions.push(lineLoc);
                }
                // else: do nothing
            } else if ((lineSpacing * scale) >= minSubUnitDistance && renderSubDivisions) {
                result.subDivisions.push(lineLoc);
            }
        }
    }
    return result;

    // const maxDimension = Math.max(canvasWidth, canvasHeight);
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
    stateCopy.showGrid = !stateCopy.showGrid;
    return stateCopy;
}

export function toggleShowSubDivisions(stateCopy) {
    stateCopy.showSubDivisions = !stateCopy.showSubDivisions;
    return stateCopy;
}
