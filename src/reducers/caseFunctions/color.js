export function convertToRGBfromRGB(stateCopy, action) {
    stateCopy.c_strokeColor.value[0] = action.color.r;
    stateCopy.c_strokeColor.value[1] = action.color.g;
    stateCopy.c_strokeColor.value[2] = action.color.b;
    console.log();
    return stateCopy;
}

// update state color model to RGB from frontend RGB
// always takes in {r:, g:,b:} type and returns { type: ,value: ,alpha: }
function convertRGBtoRGB(colorObj) {
    // return
    console.log("convert rgb to rgb");
    return 0;
}

function convertRGBtoHSL(colorObj) {
    // return
    console.log("convert rgb to hsl");
    return 0;
}

function convertRGBtoCMYK(colorObj) {
    // return
    console.log("convert rgb to cmyk");
    return 0;
}

function convertRGBtoHEX(colorObj) {
    // return
    console.log("convert rgb to hex");
    return 0;
}

export function convertColor(stateCopy, colorObj) {
    if (stateCopy.docColorMode === "RGB") {
    // update state color model
        convertRGBtoRGB(colorObj);
    } else if (stateCopy.docColorMode === "CMYK") {
        convertRGBtoCMYK(colorObj);
    } else if (stateCopy.docColorMode === "HSL") {
        convertRGBtoHSL(colorObj);
    } else {
        convertRGBtoHEX(colorObj);
    }
}
