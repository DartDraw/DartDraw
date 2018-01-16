// https://github.com/Robbbb/VectorRuler/blob/master/rulerGenerator.js

var tickLengthMultiplier = 0.75;
var pixelsPerInch = 72;

export function setRulers(stateCopy) {
    const { ruler, scale, panX, panY } = stateCopy;

    stateCopy.ruler = updateRulers(ruler, scale, panX, panY);

    return stateCopy;
}

export function updateRulers(ruler, scale, panX, panY) {
    // const { ruler, scale, panX, panY } = stateCopy;

    var pixelsPerUnit = pixelsPerInch * scale;

    var xPanOffset = panX * scale;
    var yPanOffset = panY * scale;

    ruler.top = buildRuler(ruler, pixelsPerUnit, window.innerWidth, xPanOffset);
    ruler.left = buildRuler(ruler, pixelsPerUnit, window.innerHeight, yPanOffset);

    return ruler;
}

function buildRuler(ruler, pixelsPerUnit, windowLength, panOffset) {
    const labelOffset = 2;
    const rulerLengthInUnits = Math.ceil((windowLength + panOffset) / pixelsPerUnit);
    var masterTickIndex = [];
    var result = {};
    result.ticks = [];
    result.labels = [];

    // loop thru each desired level of ticks, inches, halves, quarters, etc...
    for (var exponentIndex = 0; exponentIndex <= ruler.exponent; exponentIndex++) {
        var tickLevel = Math.pow(ruler.base, exponentIndex);
        var tickQty = rulerLengthInUnits * tickLevel;

        for (var i = 0; i <= tickQty; i++) {
            var tickLength = ruler.pixelWidth * Math.pow(tickLengthMultiplier, exponentIndex);
            var tickLoc = pixelsPerUnit / tickLevel * i - panOffset;

            // var finalTick = false;
            //
            // if (i === tickQty) {
            //     finalTick = true;
            // }

            // ADD IN FINAL TICK LATER

            if (masterTickIndex.indexOf(tickLoc) === -1) {
                if (tickLoc >= 0) {
                    result.ticks.push([tickLength, tickLoc]);
                }
                masterTickIndex.push(tickLoc);
            }

            if (exponentIndex === 0 && tickLoc >= 0) { // if is a primary tick, it needs a label
                result.labels.push([tickLength - labelOffset, tickLoc + labelOffset, i]);
            }
        }
    }
    return result;
}

// tick(result, tickLength, tickIndex, exponentIndex, tickSpacing, panOffset, finalTick, masterTickIndex);

// function tick(result, tickLength, tickIndex, exponentIndex, tickSpacing, panOffset, finalTick, masterTickIndex) {
//     var tickLoc = tickSpacing * tickIndex - panOffset;
//     var labelOffset = 2;
//
//     if (masterTickIndex.indexOf(tickLoc) === -1) {
//         if (tickLoc >= 0) {
//             result.ticks.push([tickLength, tickLoc]);
//         }
//         masterTickIndex.push(tickLoc);
//     }
//
//     if (exponentIndex === 0) { // if is a primary tick, it needs a label
//         if (tickLoc >= 0) {
//             result.labels.push([tickLength - labelOffset, tickLoc + labelOffset, tickIndex, finalTick]);
//         }
//     }
//
//     return result;
// }
