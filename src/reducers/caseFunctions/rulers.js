// https://github.com/Robbbb/VectorRuler/blob/master/rulerGenerator.js

// constants & not customizable
var tickLengthMultiplier = 0.75;
// var cmPerInch = 2.54;

export function updateRuler(stateCopy, action, root) {
    const { ruler, scale } = stateCopy;
    var pixelsPerUnit = 72 * scale;
    var subUnitBase = 2;
    var masterTickIndex = [];
    stateCopy.majorGrid = pixelsPerUnit;
    stateCopy.minorGrid = pixelsPerUnit / ruler.subDivisions;

    // ruler.horizontalTicks = [];
    // ruler.verticalTicks = [];
    ruler.ticks = [];
    ruler.labels = [];

    for (var exponentIndex = 0; exponentIndex <= Math.log2(ruler.subDivisions); exponentIndex++) {
        // loop thru each desired level of ticks, inches, halves, quarters, etc...
        var tickQty = ruler.width * Math.pow(subUnitBase, exponentIndex);
        // var highestTickDenomonatorMultiplier = ruler.ticksPerUnit / Math.pow(ruler.subUnitBase, exponentIndex)
        // to prevent reduntant ticks, this multiplier is applied to current units to ensure consistent indexing of ticks.

        for (var tickIndex = 0; tickIndex <= tickQty; tickIndex++) {
            // ruler.masterTickIndex = highestTickDenomonatorMultiplier * tickIndex;

            var tickLength = ruler.height * Math.pow(tickLengthMultiplier, exponentIndex);

            var tickSpacing = pixelsPerUnit / Math.pow(subUnitBase, exponentIndex);

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
    var lengthOffset = 4;
    var widthOffset = 0;
    ruler.labels.push([tickLength + widthOffset, tickLoc + lengthOffset, tickIndex, finalTick]);
}
