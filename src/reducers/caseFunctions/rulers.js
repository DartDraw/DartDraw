// https://github.com/Robbbb/VectorRuler/blob/master/rulerGenerator.js

var tickLengthMultiplier = 0.75;
var pixelsPerInch = 72;

export function setRulers(stateCopy) {
    const { ruler, scale, panX, panY, canvasWidth, canvasHeight } = stateCopy;

    stateCopy.ruler = updateRulers(ruler, scale, panX, panY, canvasWidth, canvasHeight);

    return stateCopy;
}

export function updateRulers(ruler, scale, panX, panY, canvasWidth, canvasHeight) {
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
    var pixelsSinceLastLabel = 11110;

    // loop thru each desired level of ticks, inches, halves, quarters, etc...
    for (var exponentIndex = 0; exponentIndex <= ruler.exponent; exponentIndex++) {
        var ticksPerUnit = Math.pow(ruler.base, exponentIndex);
        var tickQty = rulerLengthInUnits * ticksPerUnit;

        for (var i = 0; i <= tickQty; i++) {
            var tickLength = ruler.pixelWidth * Math.pow(tickLengthMultiplier, exponentIndex);
            var tickSpacing = pixelsPerUnit / ticksPerUnit;
            if (tickSpacing < 10) {
                // don't render ticks that are too close together
                break;
            } else {
                var tickLoc = tickSpacing * i - panOffset;

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
                    console.log("considering adding %i to ruler", i);
                    if (pixelsSinceLastLabel >= 50) {
                        console.log("added %i because there've been %i pixels since the last label", i, pixelsSinceLastLabel);
                        result.labels.push([tickLength - labelOffset, tickLoc + labelOffset, i]);
                        pixelsSinceLastLabel = 0;
                    }
                    pixelsSinceLastLabel += tickSpacing;
                    console.log("incrementing by %i for a total of %i", tickSpacing, pixelsSinceLastLabel);
                }
            }
        }
    }
    return result;
}

// function limitTickQty() {
//     // Prevent it from crashing if it tries to render too many linest
//     ruler.ticksPerUnit = Math.pow(ruler.subUnitBase,ruler.subUnitExponent)
//     ruler.masterTickQty = ruler.ticksPerUnit * ruler.width
//     if(ruler.height>100){
//          ruler.height= 15
//          document.getElementById("rulerHeight").value = ruler.height;
//     }
//     if(ruler.width>1000){
//         console.info("Unreasonable tick quantity: "+ ruler.masterTickQty + " reducing width")
//          ruler.width= 500
//          document.getElementById("rulerWidth").value = ruler.width;
//     }
//      if(ruler.masterTickQty > 10000){
//         console.info("Unreasonable tick quantity: "+ ruler.masterTickQty + " reducing exponent")
//         if(ruler.subUnitExponent>1){
//         ruler.subUnitExponent = ruler.subUnitExponent -1
//         document.getElementById("subUnitExponent")[ruler.subUnitExponent].selected = true;
//         }
//      }
//     if(ruler.ticksPerUnit > 100){
//         console.info("Unreasonable exponent: "+ ruler.ticksPerUnit+ " resetting to reasonable")
//         ruler.subUnitExponent = 1
//         document.getElementById("subUnitExponent")[ruler.subUnitExponent].selected = true;//selects resonable
//     }
// }

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
