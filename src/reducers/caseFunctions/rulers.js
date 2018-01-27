// https://github.com/Robbbb/VectorRuler/blob/master/rulerGenerator.js
import { updateGrid } from './grid';

const tickLengthMultiplier = 0.75;
const pixelsPerInch = 72;
const pixelsPerPoint = 72;
const pixelsPerCm = 72 / 2;
const labelOffset = 2;
const minTickDistance = 10;
const minLabelDistance = 20;

export function toggleShowRulers(stateCopy) {
    stateCopy.rulerPreferences.showRulers = !stateCopy.rulerPreferences.showRulers;
    return stateCopy;
}

export function setUnitType(stateCopy, action) {
    const { scale, panX, panY, gridPreferences, canvasWidth, canvasHeight } = stateCopy;
    const { unitType } = action.payload;

    stateCopy.ruler.unitType = unitType;

    // stateCopy.ruler = updateRulers(stateCopy.ruler, gridPreferences, scale, panX, panY, canvasWidth, canvasHeight);
    // stateCopy.gridLines = updateGrid(stateCopy.ruler, gridPreferences, scale, canvasWidth, canvasHeight);
    const { r, g } = updateRulers(stateCopy.ruler, gridPreferences, scale, panX, panY, canvasWidth, canvasHeight);
    stateCopy.ruler = r;
    stateCopy.gridLines = g;
    return stateCopy;
}

export function setUnitDivisions(stateCopy, action) {
    const { scale, panX, panY, gridPreferences, canvasWidth, canvasHeight } = stateCopy;
    const { unitDivisions } = action.payload;

    stateCopy.ruler.unitDivisions = unitDivisions;

    // stateCopy.ruler = updateRulers(stateCopy.ruler, gridPreferences, scale, panX, panY, canvasWidth, canvasHeight);
    // stateCopy.gridLines = updateGrid(stateCopy.ruler, gridPreferences, scale, canvasWidth, canvasHeight);
    const { r, g } = updateRulers(stateCopy.ruler, gridPreferences, scale, panX, panY, canvasWidth, canvasHeight);
    stateCopy.ruler = r;
    stateCopy.gridLines = g;
    return stateCopy;
}

export function setRulers(stateCopy) {
    const { ruler, gridPreferences, scale, panX, panY, canvasWidth, canvasHeight } = stateCopy;
    // stateCopy.gridLines = updateGrid(stateCopy.ruler, gridPreferences, scale, canvasWidth, canvasHeight);
    const { r, g } = updateRulers(ruler, gridPreferences, scale, panX, panY, canvasWidth, canvasHeight);
    stateCopy.ruler = r;
    stateCopy.gridLines = g;
    return stateCopy;
}

export function updateRulers(ruler, gridPreferences, scale, panX, panY, canvasWidth, canvasHeight) {
    var pixelsPerUnit;
    var subUnitBase;
    var subUnitExponent;

    const xPanOffset = panX * scale;
    const yPanOffset = panY * scale;

    if (ruler.unitType === "in" || ruler.unitType === "ft") {
        pixelsPerUnit = pixelsPerInch * scale;
    } else if (ruler.unitType === "px") {
        pixelsPerUnit = scale;
    } else if (ruler.unitType === "pt") {
        pixelsPerUnit = pixelsPerPoint * scale;
    } else { // m, cm, or mm
        pixelsPerUnit = pixelsPerCm * scale;
    }

    if (getBaseLog(2, ruler.unitDivisions) % 1 === 0) {
        subUnitBase = 2;
    } else if (getBaseLog(10, ruler.unitDivisions) % 1 === 0) {
        subUnitBase = 10;
    } else {
        subUnitBase = ruler.unitDivisions;
    }

    subUnitExponent = getBaseLog(subUnitBase, ruler.unitDivisions);

    ruler.top = buildRuler(ruler, pixelsPerUnit, subUnitBase, subUnitExponent, window.innerWidth, xPanOffset);
    ruler.left = buildRuler(ruler, pixelsPerUnit, subUnitBase, subUnitExponent, window.innerHeight, yPanOffset);
    var gridLines = updateGrid(ruler, gridPreferences, pixelsPerUnit, subUnitBase, subUnitExponent, scale, canvasWidth, canvasHeight);

    var r = ruler;
    var g = gridLines;
    return { r, g };
}

function buildRuler(ruler, pixelsPerUnit, subUnitBase, subUnitExponent, windowLength, panOffset) {
    const rulerLengthInUnits = Math.ceil((windowLength + panOffset) / pixelsPerUnit);
    var masterTickIndex = [];
    var result = {};
    result.ticks = [];
    result.labels = [];

    // loop thru each desired level of ticks, inches, halves, quarters, etc...
    for (var exponentIndex = 0; exponentIndex <= subUnitExponent; exponentIndex++) {
        const ticksPerUnit = Math.pow(subUnitBase, exponentIndex);
        const tickQty = rulerLengthInUnits * ticksPerUnit;
        const tickLength = ruler.pixelWidth * Math.pow(tickLengthMultiplier, exponentIndex);
        const tickSpacing = pixelsPerUnit / ticksPerUnit;
        var labelRender = 1;

        if (exponentIndex === 0 && tickSpacing < minLabelDistance) {
            labelRender = Math.ceil(minLabelDistance / tickSpacing);
        }

        for (var i = 0; i <= tickQty; i++) {
            var tickLoc = tickSpacing * i - panOffset;

            // if tick location is off the ruler OR if it's already been rendered
            if (tickLoc < 0 || masterTickIndex.indexOf(tickLoc) !== -1) {
                continue;
            }
            // var finalTick = false;
            //
            // if (i === tickQty) {
            //     finalTick = true;
            // }

            // ADD IN FINAL TICK LATER

            masterTickIndex.push(tickLoc);

            // if is a primary tick, it needs a label
            if (exponentIndex === 0) {
                if (i % labelRender === 0) {
                    result.labels.push([tickLength - labelOffset, tickLoc + labelOffset, i]);
                    result.ticks.push([tickLength, tickLoc]);
                }
                // else: do nothing
            } else if (tickSpacing >= minTickDistance) {
                result.ticks.push([tickLength, tickLoc]);
            }
        }
    }
    return result;
}

function getBaseLog(x, y) {
    if (x === 1) {
        return 1;
    }
    return Math.log(y) / Math.log(x);
}
