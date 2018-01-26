// https://github.com/Robbbb/VectorRuler/blob/master/rulerGenerator.js
import { updateGrid } from './grid';

const tickLengthMultiplier = 0.5;
const pixelsPerInch = 72;
const pixelsPerPoint = 72;
const pixelsPerCm = 72 / 2.54;
const labelOffset = 2;
const minTickDistance = 10;
const minLabelDistance = 10;

export function setRulers(stateCopy) {
    // const { ruler, gridPreferences, scale, panX, panY, canvasWidth, canvasHeight } = stateCopy;
    //
    // stateCopy.ruler = updateRulers(ruler, scale, panX, panY, canvasWidth, canvasHeight);
    // stateCopy.gridLines = updateGrid(stateCopy.ruler, gridPreferences, scale, canvasWidth, canvasHeight);
    //
    // return stateCopy;
}

export function updateRulers(ruler, scale, panX, panY, canvasWidth, canvasHeight) {
    var pixelsPerUnit;
    var unitBase;

    if (
        ruler.unitType === "in" ||
        ruler.unitType === "ft"
    ) {
        pixelsPerUnit = pixelsPerInch * scale;
        unitBase = 2;
    } else if (ruler.unitType === "px") {
        pixelsPerUnit = scale;
        unitBase = 2;
    } else if (ruler.unitType === "pt") {
        pixelsPerUnit = pixelsPerPoint * scale;
        unitBase = 2;
    } else {
        // m, cm, or mm
        pixelsPerUnit = pixelsPerCm * scale;
        unitBase = 10;
    }

    const xPanOffset = panX * scale;
    const yPanOffset = panY * scale;

    ruler.top = buildRuler(ruler, pixelsPerUnit, unitBase, window.innerWidth, xPanOffset);
    ruler.left = buildRuler(ruler, pixelsPerUnit, unitBase, window.innerHeight, yPanOffset);

    return ruler;
}

export function toggleShowRulers(stateCopy) {
    stateCopy.rulerPreferences.showRulers = !stateCopy.rulerPreferences.showRulers;
    return stateCopy;
}

export function setUnitType(stateCopy, action) {
    const { scale, panX, panY, gridPreferences, canvasWidth, canvasHeight } = stateCopy;
    const { unitType } = action.payload;

    stateCopy.ruler.unitType = unitType;
    stateCopy.ruler = updateRulers(stateCopy.ruler, scale, panX, panY, canvasWidth, canvasHeight);
    stateCopy.gridLines = updateGrid(stateCopy.ruler, gridPreferences, scale, canvasWidth, canvasHeight);

    return stateCopy;
}

export function setRulerExponent(stateCopy, action) {
    const { scale, panX, panY, gridPreferences, canvasWidth, canvasHeight } = stateCopy;
    const { exponent } = action.payload;

    stateCopy.ruler.exponent = exponent;
    stateCopy.ruler = updateRulers(stateCopy.ruler, scale, panX, panY, canvasWidth, canvasHeight);
    stateCopy.gridLines = updateGrid(stateCopy.ruler, gridPreferences, scale, canvasWidth, canvasHeight);

    return stateCopy;
}

function buildRuler(ruler, pixelsPerUnit, unitBase, windowLength, panOffset) {
    const rulerLengthInUnits = Math.ceil((windowLength + panOffset) / pixelsPerUnit);
    var masterTickIndex = [];
    var result = {};
    result.ticks = [];
    result.labels = [];

    // loop thru each desired level of ticks, inches, halves, quarters, etc...
    for (var exponentIndex = 0; exponentIndex <= ruler.exponent; exponentIndex++) {
        const ticksPerUnit = Math.pow(unitBase, exponentIndex);
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
