// https://github.com/Robbbb/VectorRuler/blob/master/rulerGenerator.js
import { updateGrid } from './grid';

const tickLengthMultiplier = 0.75;
const pixelsPerInch = 72;
const labelOffset = 2;
const minTickDistance = 20;
const minLabelDistance = 20;

export function setRulers(stateCopy) {
    const { ruler, gridPreferences, gridLines, scale, panX, panY, canvasWidth, canvasHeight } = stateCopy;

    stateCopy.ruler = updateRulers(ruler, scale, panX, panY, canvasWidth, canvasHeight);
    stateCopy.gridLines = updateGrid(ruler, gridPreferences, gridLines, scale, canvasWidth, canvasHeight);

    return stateCopy;
}

export function updateRulers(ruler, scale, panX, panY, canvasWidth, canvasHeight) {
    const pixelsPerUnit = pixelsPerInch * scale;
    const xPanOffset = panX * scale;
    const yPanOffset = panY * scale;

    ruler.top = buildRuler(ruler, pixelsPerUnit, window.innerWidth, xPanOffset);
    ruler.left = buildRuler(ruler, pixelsPerUnit, window.innerHeight, yPanOffset);

    return ruler;
}

export function toggleShowRulers(stateCopy) {
    stateCopy.rulerPreferences.showRulers = !stateCopy.rulerPreferences.showRulers;
    return stateCopy;
}

export function setUnitType(stateCopy, action) {
    const { unitType } = action.payload;
    stateCopy.ruler.unitType = unitType;
    return stateCopy;
}

export function setRulerBase(stateCopy, action) {
    const { base } = action.payload;
    stateCopy.ruler.base = base;
    console.log(base);
    console.log("^BASE^");
    return stateCopy;
}

export function setRulerExponent(stateCopy, action) {
    const { exponent } = action.payload;
    stateCopy.ruler.exponent = exponent;
    console.log(exponent);
    console.log("^EX^");
    return stateCopy;
}

function buildRuler(ruler, pixelsPerUnit, windowLength, panOffset) {
    const rulerLengthInUnits = Math.ceil((windowLength + panOffset) / pixelsPerUnit);
    var masterTickIndex = [];
    var result = {};
    result.ticks = [];
    result.labels = [];

    // loop thru each desired level of ticks, inches, halves, quarters, etc...
    for (var exponentIndex = 0; exponentIndex <= ruler.exponent; exponentIndex++) {
        const ticksPerUnit = Math.pow(ruler.base, exponentIndex);
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
