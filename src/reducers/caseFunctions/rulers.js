// used as reference: https://github.com/Robbbb/VectorRuler/blob/master/rulerGenerator.js
import { buildGrid } from './grid';

const pixelsPerInch = 96;
const pixelsPerPoint = 72;
const pixelsPerCm = pixelsPerInch / 2.54;

export function toggleShowRulers(stateCopy) {
    stateCopy.showRulers = !stateCopy.showRulers;
    return stateCopy;
}

export function setRulerGrid(stateCopy, action) {
    const { unitType, width, height, unitDivisions } = action.payload;

    stateCopy.ruler.unitDivisions = unitDivisions;
    stateCopy.ruler.unitType = unitType;

    switch (unitType) {
        case "in":
            stateCopy.ruler.pixelsPerUnit = pixelsPerInch;
            break;
        case "ft":
            stateCopy.ruler.pixelsPerUnit = pixelsPerInch * 12;
            break;
        case "mm":
            stateCopy.ruler.pixelsPerUnit = pixelsPerCm / 10;
            break;
        case "cm":
            stateCopy.ruler.pixelsPerUnit = pixelsPerCm;
            break;
        case "m":
            stateCopy.ruler.pixelsPerUnit = pixelsPerCm * 100;
            break;
        case "px":
            stateCopy.ruler.pixelsPerUnit = 1;
            break;
        case "pt":
            stateCopy.ruler.pixelsPerUnit = pixelsPerPoint;
            break;
        default:
            break;
    }

    stateCopy.canvasWidth = width * stateCopy.ruler.pixelsPerUnit;
    stateCopy.canvasHeight = height * stateCopy.ruler.pixelsPerUnit;

    stateCopy.panX = 0;
    stateCopy.panY = 0;

    const { ruler, gridLines } = updateRulerGrid(stateCopy, stateCopy.scale, stateCopy.panX, stateCopy.panY);

    stateCopy.ruler = ruler;
    stateCopy.gridLines = gridLines;

    return stateCopy;
}

export function updateRulerGrid(stateCopy, scale, panX, panY) {
    var { ruler, canvasWidth, canvasHeight } = stateCopy;

    const xPanOffset = panX * scale;
    const yPanOffset = panY * scale;
    const minTickDistance = 15;

    var subUnitBase;

    if (getBaseLog(2, ruler.unitDivisions) % 1 === 0) {
        subUnitBase = 2;
    } else if (getBaseLog(10, ruler.unitDivisions) % 1 === 0) {
        subUnitBase = 10;
    } else {
        subUnitBase = ruler.unitDivisions;
    }

    var subUnitExponent = getBaseLog(subUnitBase, ruler.unitDivisions);
    var scaledPixelsPerUnit = ruler.pixelsPerUnit * scale;

    const canvasWidthInUnits = canvasWidth / ruler.pixelsPerUnit;
    const canvasHeightInUnits = canvasHeight / ruler.pixelsPerUnit;

    // need to account for the number of digits in the labels
    const pixelsPerDigit = 10;
    const minLabelDistance = canvasWidthInUnits.toString().length * pixelsPerDigit * 2;
    const minRulerWidth = canvasHeightInUnits.toString().length * pixelsPerDigit;

    if (minRulerWidth > ruler.width) {
        ruler.width = minRulerWidth;
    }

    ruler.horizontal = buildRuler(ruler.width, scaledPixelsPerUnit, subUnitBase, subUnitExponent, minLabelDistance, minTickDistance, canvasWidthInUnits, xPanOffset);
    ruler.vertical = buildRuler(ruler.width, scaledPixelsPerUnit, subUnitBase, subUnitExponent, minLabelDistance, minTickDistance, canvasHeightInUnits, yPanOffset);

    const gridLines = buildGrid(ruler, scale, subUnitBase, subUnitExponent, minLabelDistance, minTickDistance, canvasWidth, canvasHeight);

    return { ruler, gridLines };
}

function buildRuler(rulerWidth, scaledPixelsPerUnit, subUnitBase, subUnitExponent, minLabelDistance, minTickDistance, canvasInUnits, panOffset) {
    const multiplier = (subUnitExponent === 1) ? 0.5 : 0.75;
    var masterTickIndex = [];

    var result = addWholeUnits(rulerWidth, scaledPixelsPerUnit, minLabelDistance, minTickDistance, canvasInUnits, panOffset);

    for (var exponentIndex = 1; exponentIndex <= subUnitExponent; exponentIndex++) {
        const ticksPerUnit = Math.pow(subUnitBase, exponentIndex);
        const tickQty = canvasInUnits * ticksPerUnit;
        const tickLength = rulerWidth * Math.pow(multiplier, exponentIndex);
        const tickSpacing = scaledPixelsPerUnit / ticksPerUnit;

        if (tickSpacing < minTickDistance) {
            break;
        }

        for (let i = 0; i <= tickQty; i++) {
            var tickLoc = tickSpacing * i - panOffset;

            // if tick location is off the ruler OR if it's already been rendered
            if (tickLoc < panOffset || i % ticksPerUnit === 0 || masterTickIndex.indexOf(tickLoc) !== -1) {
                continue;
            }

            masterTickIndex.push(tickLoc);

            result.ticks.push({loc: tickLoc, length: tickLength});
        }
    }

    return result;
}

function addWholeUnits(rulerWidth, scaledPixelsPerUnit, minLabelDistance, minTickDistance, canvasInUnits, panOffset) {
    var ruler = {};
    ruler.ticks = [];
    ruler.labels = [];

    var labelInterval = 1;
    var tickInterval = 1;
    var scalingFactor = 1;
    const multiplier = 0.5;
    const intervalArray = [2, 2.5, 5, 10];
    const divisionArrray = [2, 4, 5, 10];

    if (scaledPixelsPerUnit < minLabelDistance) {
        labelInterval = Math.ceil(minLabelDistance / scaledPixelsPerUnit);

        while (labelInterval > intervalArray[intervalArray.length - 1] * scalingFactor) {
            scalingFactor *= 10;
        }

        for (let i = 0; i < intervalArray.length; i++) {
            if (labelInterval < (intervalArray[i] * scalingFactor)) {
                labelInterval = intervalArray[i] * scalingFactor;
                if (labelInterval !== 2.5) {
                    break;
                }
            }
        }
    }

    if (scaledPixelsPerUnit < minTickDistance) {
        scalingFactor = 1;
        tickInterval = Math.ceil(minTickDistance / scaledPixelsPerUnit);

        while (tickInterval > intervalArray[intervalArray.length - 1] * scalingFactor) {
            scalingFactor *= 10;
        }

        for (let i = 0; i < intervalArray.length; i++) {
            if (tickInterval < (intervalArray[i] * scalingFactor)) {
                tickInterval = intervalArray[i] * scalingFactor;
                if (tickInterval !== 2.5 && divisionArrray.indexOf(labelInterval / tickInterval) === -1) {
                    break;
                }
            }
        }
        if (divisionArrray.indexOf(labelInterval / tickInterval) === -1) {
            tickInterval = labelInterval;
        }
    }
    var finalLabel = false;

    for (let i = 0; i <= canvasInUnits; i++) {
        var tickLoc = scaledPixelsPerUnit * i - panOffset;

        if (tickLoc < 0) {
            continue;
        }

        // if is a primary tick, it needs a label
        if (i % labelInterval === 0) {
            if ((i + labelInterval) > canvasInUnits && i !== 0) {
                finalLabel = true;
            }
            ruler.labels.push({loc: tickLoc, num: i, final: finalLabel});
            ruler.ticks.push({loc: tickLoc, length: rulerWidth});
        } else if (i % tickInterval === 0) {
            ruler.ticks.push({loc: tickLoc, length: rulerWidth * multiplier});
        }
    }

    return ruler;
}

function getBaseLog(x, y) {
    if (x === 1) {
        return 1;
    }
    return Math.log(y) / Math.log(x);
}
