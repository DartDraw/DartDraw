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

export function buildGrid(ruler, scale, subUnitBase, subUnitExponent, minWholeUnitDistance, minSubUnitDistance, canvasWidth, canvasHeight) {
    const gridDimensionInUnits = Math.ceil(Math.max(canvasWidth, canvasHeight) / ruler.pixelsPerUnit);
    var masterLineIndex = [];
    var renderSubDivisions = true;
    var result = [];

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

            if (exponentIndex === 0) {
                if (i % labelInterval === 0 && i !== 0) {
                    result.push({loc: lineLoc, major: true});
                } else if ((lineSpacing * scale) >= minSubUnitDistance && !renderSubDivisions) {
                    result.push({loc: lineLoc, major: false});
                }
            } else if ((lineSpacing * scale) >= minSubUnitDistance && renderSubDivisions) {
                result.push({loc: lineLoc, major: false});
            }
        }
    }
    return result;
}
