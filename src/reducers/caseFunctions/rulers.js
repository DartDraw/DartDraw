// https://github.com/Robbbb/VectorRuler/blob/master/rulerGenerator.js
import { buildGrid } from './grid';

const pixelsPerInch = 96;
const pixelsPerPoint = 72;
const pixelsPerCm = pixelsPerInch / 2.54;

const labelOffset = 2;
export const minTickDistance = 9;

export function toggleShowRulers(stateCopy) {
    stateCopy.showRulers = !stateCopy.showRulers;
    return stateCopy;
}

export function setMouseTrackers(ruler, x, y) {
    ruler.mouseCoords.x = x;
    ruler.mouseCoords.y = y;

    return ruler;
}

// function setUnitType(ruler, unitType) {
//     // const { canvasWidth, canvasHeight } = stateCopy;
//
//     ruler.unitType = unitType;
//
//     switch (unitType) {
//         case "in":
//             ruler.pixelsPerUnit = pixelsPerInch;
//             break;
//         case "ft":
//             ruler.pixelsPerUnit = pixelsPerInch * 12;
//             break;
//         case "mm":
//             ruler.pixelsPerUnit = pixelsPerCm / 10;
//             break;
//         case "cm":
//             ruler.pixelsPerUnit = pixelsPerCm;
//             break;
//         case "m":
//             ruler.pixelsPerUnit = pixelsPerCm * 100;
//             break;
//         case "px":
//             ruler.pixelsPerUnit = 1;
//             break;
//         case "pt":
//             ruler.pixelsPerUnit = pixelsPerPoint;
//             break;
//         default:
//             break;
//     }
//
//     // var widthInUnits = canvasWidth / stateCopy.ruler.pixelsPerUnit;
//     // var heightInUnits = canvasHeight / stateCopy.ruler.pixelsPerUnit;
//     //
//     // stateCopy = setCanvasSizeHelper(stateCopy, widthInUnits, heightInUnits);
//
//     return ruler;
// }

// export function setUnitDivisions(stateCopy, action) {
//     const { scale, panX, panY, canvasWidth, canvasHeight } = stateCopy;
//     const { unitDivisions } = action.payload;
//
//     stateCopy.ruler.unitDivisions = unitDivisions;
//
//     const { ruler, gridLines } = updateGridRulers(stateCopy.ruler, scale, panX, panY, canvasWidth, canvasHeight);
//     stateCopy.ruler = ruler;
//     stateCopy.gridLines = gridLines;
//     return stateCopy;
// }

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

    var panX = 0;
    var panY = 0;

    const { ruler, gridLines } = updateGridRulers(stateCopy, stateCopy.scale, panX, panY);

    stateCopy.ruler = ruler;
    stateCopy.gridLines = gridLines;

    return stateCopy;
}

// function setCanvasSizeHelper(stateCopy, width, height) {
//     const { pixelsPerUnit } = stateCopy.ruler;
//
//     stateCopy.canvasWidth = width * pixelsPerUnit;
//     stateCopy.canvasHeight = height * pixelsPerUnit;
//     stateCopy.panX = 0;
//     stateCopy.panY = 0;
//
//     // stateCopy = setGridRulers(stateCopy);
//
//     return stateCopy;
// }

// export function setGridRulers(stateCopy) {
//     const { scale, panX, panY, canvasWidth, canvasHeight } = stateCopy;
//     const { ruler, gridLines } = updateGridRulers(stateCopy.ruler, scale, panX, panY, canvasWidth, canvasHeight);
//     stateCopy.ruler = ruler;
//     stateCopy.gridLines = gridLines;
//     return stateCopy;
// }

export function updateGridRulers(stateCopy, scale, panX, panY) {
    var { ruler, canvasWidth, canvasHeight } = stateCopy;
    var subUnitBase;
    var subUnitExponent;
    var scaledPixelsPerUnit = ruler.pixelsPerUnit * scale;

    const xPanOffset = panX * scale;
    const yPanOffset = panY * scale;

    if (getBaseLog(2, ruler.unitDivisions) % 1 === 0) {
        subUnitBase = 2;
    } else if (getBaseLog(10, ruler.unitDivisions) % 1 === 0) {
        subUnitBase = 10;
    } else {
        subUnitBase = ruler.unitDivisions;
    }

    subUnitExponent = getBaseLog(subUnitBase, ruler.unitDivisions);

    // const rulerLengthInUnits = Math.ceil((Math.max(window.innerWidth, canvasWidth) + xPanOffset) / scaledPixelsPerUnit);
    const canvasWidthInUnits = Math.ceil(canvasWidth / ruler.pixelsPerUnit);
    const canvasHeightInUnits = Math.ceil(canvasHeight / ruler.pixelsPerUnit);

    // need to account for the number of digits in the labels
    // const tickQty = canvasInUnits * subUnitBase;
    const minLabelDistance = 10 * Math.max(canvasHeightInUnits, canvasWidthInUnits).toString().length;

    ruler.horizontal = buildRuler(ruler, scaledPixelsPerUnit, subUnitBase, subUnitExponent, minLabelDistance, canvasWidthInUnits, xPanOffset);
    ruler.vertical = buildRuler(ruler, scaledPixelsPerUnit, subUnitBase, subUnitExponent, minLabelDistance, canvasHeightInUnits, yPanOffset);
    const gridLines = buildGrid(ruler, scale, subUnitBase, subUnitExponent, minLabelDistance, canvasWidth, canvasHeight);

    return { ruler, gridLines };
}

function buildRuler(ruler, scaledPixelsPerUnit, subUnitBase, subUnitExponent, minLabelDistance, canvasInUnits, panOffset) {
    var result = {};
    result.ticks = [];
    result.labels = [];

    var labelInterval = 1;
    var tickInterval = 1;
    var scalingFactor = 1;
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
                console.log(labelInterval, tickInterval, labelInterval / tickInterval);
                if (tickInterval !== 2.5) {
                    console.log(divisionArrray.indexOf(labelInterval / tickInterval));
                    break;
                }
            }
        }
        if (divisionArrray.indexOf(labelInterval / tickInterval) === -1) {
            tickInterval = labelInterval;
        }
    }

    for (let i = 0; i <= canvasInUnits; i++) {
        var tickLoc = scaledPixelsPerUnit * i - panOffset;
        var tickLength;

        if (tickLoc < 0) {
            continue;
        }

        // if is a primary tick, it needs a label
        if (i % labelInterval === 0) {
            tickLength = ruler.width;
            result.labels.push([tickLength - labelOffset, tickLoc + labelOffset, i]);
            result.ticks.push([tickLength, tickLoc]);
        } else if (i % tickInterval === 0) {
            tickLength = ruler.width * 0.75;
            result.ticks.push([tickLength, tickLoc]);
        }
    }
    //
    // console.log(minLabelDistance, labelInterval);
    // console.log(minTickDistance, tickInterval);
    // console.log(scaledPixelsPerUnit);

    // var tickLengthMultiplier = 0.75;
    // var masterTickIndex = [];
    // var result = {};
    // result.ticks = [];
    // result.labels = [];
    //
    // var renderDivisions = true;
    //
    // // loop thru each desired level of ticks, inches, halves, quarters, etc...
    // for (var exponentIndex = 0; exponentIndex <= subUnitExponent; exponentIndex++) {
    //     const ticksPerUnit = Math.pow(subUnitBase, exponentIndex);
    //     const tickQty = rulerLengthInUnits * ticksPerUnit;
    //     const tickLength = ruler.width * Math.pow(tickLengthMultiplier, exponentIndex);
    //     const tickSpacing = scaledPixelsPerUnit / ticksPerUnit;
    //     var labelInterval = 1;
    //
    //     if (exponentIndex === 0 && tickSpacing < minLabelDistance) {
    //         const intervalArray = [2, 2.5, 5, 10];
    //         labelInterval = Math.ceil(minLabelDistance / tickSpacing);
    //         var scalingFactor = 1;
    //
    //         while (labelInterval > intervalArray[intervalArray.length - 1] * scalingFactor) {
    //             scalingFactor *= 10;
    //         }
    //
    //         for (let i = 0; i < intervalArray.length; i++) {
    //             if (labelInterval < (intervalArray[i] * scalingFactor)) {
    //                 labelInterval = intervalArray[i] * scalingFactor;
    //                 break;
    //             }
    //         }
    //     }
    //
    //     if (labelInterval > 1) {
    //         renderDivisions = false;
    //         for (let i = 0; i <= tickQty; i++) {
    //             var tickLoc = tickSpacing * i - panOffset;
    //
    //             // if tick location is off the ruler OR if it's already been rendered
    //             if (tickLoc < 0 || masterTickIndex.indexOf(tickLoc) !== -1) {
    //                 continue;
    //             }
    //
    //             masterTickIndex.push(tickLoc);
    //
    //             // if is a primary tick, it needs a label
    //             if (exponentIndex === 0) {
    //                 if (i % labelInterval === 0) {
    //                     result.labels.push([tickLength - labelOffset, tickLoc + labelOffset, i]);
    //                     result.ticks.push([tickLength, tickLoc]);
    //                 } else if (tickSpacing >= minSubUnitDistance && !renderDivisions) {
    //                     result.ticks.push([tickLength * 0.5, tickLoc]);
    //                 }
    //             }
    //         }
    //     } else {
    //         for (let i = 0; i <= tickQty; i++) {
    //             tickLoc = tickSpacing * i - panOffset;
    //
    //             // if tick location is off the ruler OR if it's already been rendered
    //             if (tickLoc < 0 || masterTickIndex.indexOf(tickLoc) !== -1) {
    //                 continue;
    //             }
    //
    //             masterTickIndex.push(tickLoc);
    //
    //             // if is a primary tick, it needs a label
    //             if (exponentIndex === 0) {
    //                 if (i % labelInterval === 0) {
    //                     result.labels.push([tickLength - labelOffset, tickLoc + labelOffset, i]);
    //                     result.ticks.push([tickLength, tickLoc]);
    //                 }
    //             } else if (tickSpacing >= minSubUnitDistance) {
    //                 result.ticks.push([tickLength, tickLoc]);
    //             }
    //         }
    //     }
    // }
    return result;
}

function getBaseLog(x, y) {
    if (x === 1) {
        return 1;
    }
    return Math.log(y) / Math.log(x);
}

// var finalTick = false;
//
// if (i === tickQty) {
//     finalTick = true;
// }

// ADD IN FINAL TICK LATER
