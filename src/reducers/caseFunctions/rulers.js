// used as reference: https://github.com/Robbbb/VectorRuler/blob/master/rulerGenerator.js

import { setPan } from './zoom';
import { MENU_WIDTH } from '../../constants';

export function toggleShowRulers(stateCopy) {
    stateCopy.showRulers = !stateCopy.showRulers;
    return stateCopy;
}

export function selectRuler(stateCopy, action) {
    const { rulerName } = action.payload;
    const { scale, panX, panY } = stateCopy;

    stateCopy.ruler = changeRulerPreset(stateCopy.ruler, rulerName);
    stateCopy.ruler = updateRulerGrid(stateCopy, scale, panX, panY);

    return stateCopy;
}

export function addRuler(stateCopy, action) {
    const { name, unitType, unitDivisions } = action.payload;

    var newRulerPreset = {
        unitType,
        unitDivisions
    };

    stateCopy.ruler.byName[name] = newRulerPreset;

    const { scale, panX, panY } = stateCopy;

    stateCopy.ruler = changeRulerPreset(stateCopy.ruler, name);
    stateCopy.ruler = updateRulerGrid(stateCopy, scale, panX, panY);

    return stateCopy;
}

export function saveRuler(stateCopy, action) {
    const { unitType, unitDivisions } = action.payload;

    var rulerObj = stateCopy.ruler.byName[stateCopy.ruler.current];

    rulerObj.unitType = unitType;
    rulerObj.unitDivisions = unitDivisions;

    const { scale, panX, panY } = stateCopy;

    stateCopy.ruler = changeRulerPreset(stateCopy.ruler, stateCopy.ruler.current);
    stateCopy.ruler = updateRulerGrid(stateCopy, scale, panX, panY);

    return stateCopy;
}

export function deleteRuler(stateCopy) {
    var names = Object.keys(stateCopy.ruler.byName);
    var current = stateCopy.ruler.current;
    var index = names.indexOf(current);

    stateCopy.ruler.current = names[index - 1];
    delete stateCopy.ruler.byName[current];

    const { scale, panX, panY } = stateCopy;

    stateCopy.ruler = changeRulerPreset(stateCopy.ruler, stateCopy.ruler.current);
    stateCopy.ruler = updateRulerGrid(stateCopy, scale, panX, panY);

    return stateCopy;
}

export function toggleRuler(stateCopy, action) {
    const { forward } = action.payload;
    const names = Object.keys(stateCopy.ruler.byName);

    console.log(forward);

    var current = stateCopy.ruler.current;
    var index = names.indexOf(current);

    if (forward) {
        index = (index + 1) % names.length;
    } else {
        if (index === 0) {
            index = names.length - 1;
        } else {
            index = index - 1;
        }
    }

    stateCopy.ruler.current = names[index];

    const { scale, panX, panY } = stateCopy;

    stateCopy.ruler = changeRulerPreset(stateCopy.ruler, stateCopy.ruler.current);
    stateCopy.ruler = updateRulerGrid(stateCopy, scale, panX, panY);

    return stateCopy;
}

function changeRulerPreset(ruler, newRulerName) {
    var rulerObj = ruler.byName[newRulerName];

    ruler.current = newRulerName;
    ruler.unitDivisions = rulerObj.unitDivisions;
    ruler.unitType = rulerObj.unitType;
    ruler.pixelsPerUnit = setPixelsPerUnit(rulerObj.unitType);

    return ruler;
}

export function setRulerGrid(stateCopy, action) {
    if (action.payload) {
        const { unitType, width, height, unitDivisions } = constrainInput(action.payload);
        stateCopy.ruler.unitDivisions = unitDivisions;
        stateCopy.ruler.unitType = unitType;
        stateCopy.ruler.pixelsPerUnit = setPixelsPerUnit(unitType);
        stateCopy.canvasWidth = width * stateCopy.ruler.pixelsPerUnit;
        stateCopy.canvasHeight = height * stateCopy.ruler.pixelsPerUnit;
    }

    const { panX, panY } = setPan(stateCopy, stateCopy.scale);

    stateCopy.panX = panX;
    stateCopy.panY = panY;

    stateCopy.ruler = updateRulerGrid(stateCopy, stateCopy.scale, stateCopy.panX, stateCopy.panY);

    stateCopy.gridSnapInterval = stateCopy.ruler.pixelsPerUnit / stateCopy.ruler.unitDivisions;

    return stateCopy;
}

export function updateRulerGrid(stateCopy, scale, panX, panY) {
    var { ruler, canvasWidth, canvasHeight } = stateCopy;

    const pixelsPerDigit = 10;
    const minTickSpacing = 15;

    const xPanOffset = panX * scale;
    const yPanOffset = panY * scale;

    // find base 2, 10, or other
    var subUnitBase = ruler.unitDivisions;

    if (getBaseLog(2, ruler.unitDivisions) % 1 === 0) {
        subUnitBase = 2;
    } else if (getBaseLog(10, ruler.unitDivisions) % 1 === 0) {
        subUnitBase = 10;
    }

    const subUnitExponent = getBaseLog(subUnitBase, ruler.unitDivisions);
    const scaledPixelsPerUnit = ruler.pixelsPerUnit * scale;
    const windowWidth = window.innerWidth - ruler.width - MENU_WIDTH;
    const windowHeight = window.innerHeight - ruler.width - MENU_WIDTH;

    // need adjust min spacing to account for the # of digits in the ruler labels
    const minLabelSpacing = Math.ceil((canvasWidth / ruler.pixelsPerUnit)).toString().length * pixelsPerDigit * 2;
    const minRulerWidth = Math.ceil((canvasHeight / ruler.pixelsPerUnit)).toString().length * pixelsPerDigit;

    // increase the width of the ruler if necessary
    if (minRulerWidth > ruler.width) {
        ruler.width = minRulerWidth;
    }

    // construct rulers!
    ruler.horizontal = buildRuler(windowWidth, xPanOffset, scaledPixelsPerUnit, minLabelSpacing, minTickSpacing, ruler.width, subUnitBase, subUnitExponent);
    ruler.vertical = buildRuler(windowHeight, yPanOffset, scaledPixelsPerUnit, minLabelSpacing, minTickSpacing, ruler.width, subUnitBase, subUnitExponent);

    return ruler;
}

function buildRuler(windowDim, panOffset, scaledPixelsPerUnit, minLabelSpacing, minTickSpacing, rulerWidth, subUnitBase, subUnitExponent) {
    // add tick marks and labels for the whole units
    var { ruler, renderSubUnits } = addWholeUnits(windowDim, panOffset, scaledPixelsPerUnit, minLabelSpacing, minTickSpacing, rulerWidth);

    // if every unit has a label, render the subdivisions
    if (renderSubUnits) {
        ruler = addSubUnits(ruler, windowDim, panOffset, scaledPixelsPerUnit, minTickSpacing, rulerWidth, subUnitBase, subUnitExponent);
    }

    return ruler;
}

function addWholeUnits(windowDim, panOffset, scaledPixelsPerUnit, minLabelSpacing, minTickSpacing, rulerWidth) {
    var ruler = {};
    ruler.ticks = [];
    ruler.labels = [];

    // appropriate intervals between labels
    const divisionArray = [2, 4, 5, 10];

    // based on minSpacing, find out which labels to render
    // (i.e. every label, every other label, etc.)
    // same with ticks representing whole units between labels
    var labelInterval = findSpacingInterval(minLabelSpacing, scaledPixelsPerUnit, divisionArray, 0);
    var tickInterval = findSpacingInterval(minTickSpacing, scaledPixelsPerUnit, divisionArray, labelInterval);

    if (divisionArray.indexOf(labelInterval / tickInterval) === -1) {
        tickInterval = labelInterval;
    }

    const multiplier = 0.5;
    var firstLabel = true;

    // only render visible portion of the ruler
    var minUnitToRender = Math.floor(panOffset / scaledPixelsPerUnit);
    var maxUnitToRender = Math.ceil((panOffset + windowDim) / scaledPixelsPerUnit);

    for (let i = minUnitToRender; i <= maxUnitToRender; i++) {
        var tickLoc = scaledPixelsPerUnit * i - panOffset;

        if (tickLoc >= 0 && tickLoc <= windowDim) {
            // labeled ticks
            if (i % labelInterval === 0) {
                ruler.labels.push({loc: tickLoc, num: i, first: firstLabel});
                ruler.ticks.push({loc: tickLoc, length: rulerWidth, major: true});
                firstLabel = false;
            // ticks representing whole units between labeled ticks
            } else if (i % tickInterval === 0) {
                ruler.ticks.push({loc: tickLoc, length: rulerWidth * multiplier, major: false});
            }
        }
    }

    return ({
        ruler: ruler,
        renderSubUnits: (labelInterval === 1)
    });
}

function addSubUnits(ruler, windowDim, panOffset, scaledPixelsPerUnit, minTickSpacing, rulerWidth, subUnitBase, subUnitExponent) {
    const tickLengthMultiplier = (subUnitExponent === 1) ? 0.5 : 0.75;

    // make sure we don't render the same tick twice
    var masterTickIndex = [];

    // only render visible portion of the ruler
    var minUnitToRender = Math.floor(panOffset / scaledPixelsPerUnit);
    var maxUnitToRender = Math.ceil((panOffset + windowDim) / scaledPixelsPerUnit);

    // loop through each level of divisions (ex. halves, quarters, etc.)
    for (var exponentIndex = 1; exponentIndex <= subUnitExponent; exponentIndex++) {
        const ticksPerUnit = Math.pow(subUnitBase, exponentIndex);
        const tickSpacing = scaledPixelsPerUnit / ticksPerUnit;

        // don't render ticks too close together
        if (tickSpacing < minTickSpacing) {
            break;
        }

        const tickQty = (maxUnitToRender - minUnitToRender) * ticksPerUnit;
        const tickLength = rulerWidth * Math.pow(tickLengthMultiplier, exponentIndex);

        for (let i = 0; i <= tickQty; i++) {
            var tickLoc = tickSpacing * i + (scaledPixelsPerUnit * minUnitToRender) - panOffset;

            // if tick location is within visible portion of the ruler
            // AND if it hasn't been rendered yet...
            if (tickLoc >= 0 && tickLoc <= windowDim && i % ticksPerUnit !== 0 && masterTickIndex.indexOf(tickLoc) === -1) {
                ruler.ticks.push({loc: tickLoc, length: tickLength, major: false});
                masterTickIndex.push(tickLoc);
            }
        }
    }

    return ruler;
}

function findSpacingInterval(minSpacing, scaledPixelsPerUnit, divisionArray, labelInterval) {
    const labelArray = [2, 2.5, 5, 10];

    var scalingFactor = 1;
    var interval = 1;

    if (scaledPixelsPerUnit < minSpacing) {
        interval = Math.ceil(minSpacing / scaledPixelsPerUnit);

        while (interval > labelArray[labelArray.length - 1] * scalingFactor) {
            scalingFactor *= 10;
        }

        for (let i = 0; i < labelArray.length; i++) {
            if (interval < (labelArray[i] * scalingFactor)) {
                interval = labelArray[i] * scalingFactor;
                if (interval !== 2.5) {
                    if (labelInterval === 0) break;
                    else if (divisionArray.indexOf(labelInterval / interval) === -1) break;
                }
            }
        }
    }

    return interval;
}

function setPixelsPerUnit(unitType) {
    const pixelsPerInch = 96;
    const pixelsPerPoint = 1.33;
    const pixelsPerCm = pixelsPerInch / 2.54;

    var pixelsPerUnit;

    switch (unitType) {
        case "in":
            pixelsPerUnit = pixelsPerInch;
            break;
        case "ft":
            pixelsPerUnit = pixelsPerInch * 12;
            break;
        case "mm":
            pixelsPerUnit = pixelsPerCm / 10;
            break;
        case "cm":
            pixelsPerUnit = pixelsPerCm;
            break;
        case "m":
            pixelsPerUnit = pixelsPerCm * 100;
            break;
        case "px":
            pixelsPerUnit = 1;
            break;
        case "pt":
            pixelsPerUnit = pixelsPerPoint;
            break;
        default:
            break;
    }

    return pixelsPerUnit;
}

function constrainInput(payload) {
    var { unitType, width, height, unitDivisions } = payload;

    width = parseFloat(width);
    height = parseFloat(height);
    unitDivisions = parseInt(unitDivisions, 10);

    var minDim;
    var maxDim;
    var maxDiv;
    var minDiv = 1;

    switch (unitType) {
        case "in":
            minDim = 1;
            maxDim = 120;
            maxDiv = 64;
            break;
        case "ft":
            minDim = 1;
            maxDim = 10;
            maxDiv = 64;
            break;
        case "mm":
            minDim = 10;
            maxDim = 1000;
            maxDiv = 2;
            break;
        case "cm":
            minDim = 1;
            maxDim = 1000;
            maxDiv = 10;
            break;
        case "m":
            minDim = 1;
            maxDim = 10;
            maxDiv = 1000;
            break;
        case "px":
            minDim = 100;
            maxDim = 1000;
            maxDiv = 1;
            break;
        case "pt":
            minDim = 100;
            maxDim = 1000;
            maxDiv = 1;
            break;
        default:
            break;
    }

    if (width < minDim || width > maxDim) {
        width = clamp(width, minDim, maxDim);
        console.error("Canvas width is out of bounds. Setting width=%d", width);
    }
    if (height < minDim || height > maxDim) {
        height = clamp(height, minDim, maxDim);
        console.error("Canvas height is out of bounds. Setting height=%d", height);
    }
    if (unitDivisions < minDiv || unitDivisions > maxDiv) {
        unitDivisions = clamp(unitDivisions, minDiv, maxDiv);
        console.error("Number of unit divisions is out of bounds. Setting unitDivisions=%d", unitDivisions);
    }

    return ({
        unitType: unitType,
        width: width,
        height: height,
        unitDivisions: unitDivisions
    });
}

function getBaseLog(x, y) {
    if (x === 1) {
        return 1;
    }
    return Math.log(y) / Math.log(x);
}

function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}
