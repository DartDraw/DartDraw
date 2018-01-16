// https://github.com/Robbbb/VectorRuler/blob/master/rulerGenerator.js

// constants & not customizable
var tickLengthMultiplier = 0.75;
// var cmPerInch = 2.54;

export function updateRuler(stateCopy, action, root) {
    const { ruler, scale } = stateCopy;
    var pixelsPerUnit = 72 * scale;
    var masterTickIndex = [];
    var renderLength = Math.ceil(window.innerWidth / pixelsPerUnit);

    // ruler.horizontalTicks = [];
    // ruler.verticalTicks = [];
    ruler.ticks = [];
    ruler.labels = [];

    for (var exponentIndex = 0; exponentIndex <= ruler.exponent; exponentIndex++) {
        // loop thru each desired level of ticks, inches, halves, quarters, etc...
        var tickQty = renderLength * Math.pow(ruler.base, exponentIndex);
        // var highestTickDenomonatorMultiplier = ruler.ticksPerUnit / Math.pow(ruler.base, exponentIndex)
        // to prevent reduntant ticks, this multiplier is applied to current units to ensure consistent indexing of ticks.

        for (var tickIndex = 0; tickIndex <= tickQty; tickIndex++) {
            // ruler.masterTickIndex = highestTickDenomonatorMultiplier * tickIndex;

            var tickLength = 30 * Math.pow(tickLengthMultiplier, exponentIndex);

            var tickSpacing = pixelsPerUnit / Math.pow(ruler.base, exponentIndex);

            var finalTick = false;

            if (tickIndex === tickQty) {
                finalTick = true;
            }

            tick(ruler, tickLength, tickIndex, exponentIndex, tickSpacing, finalTick, masterTickIndex);
        }
    }
    return stateCopy;
}

function tick(ruler, tickLength, tickIndex, exponentIndex, tickSpacing, finalTick, masterTickIndex) {
    // exponentIndex is 0-6, with 6 being the smallest
    var tickLoc = tickSpacing * tickIndex;

    if (masterTickIndex.indexOf(tickLoc) === -1) {
        ruler.ticks.push([tickLength, tickLoc]);
        masterTickIndex.push(tickLoc);
    }

    if (exponentIndex === 0) { // if is a primary tick, it needs a label
        tickLabel(ruler, tickLength, tickLoc, finalTick, tickIndex);
    }
}

function tickLabel(ruler, tickLength, tickLoc, finalTick, tickIndex) {
    var offset = 2;
    ruler.labels.push([tickLength - offset, tickLoc + offset, tickIndex, finalTick]);
}
