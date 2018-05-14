export function convertToRGBfromRGB(stateCopy, action) {
    stateCopy.c_strokeColor.value[0] = action.color.r;
    stateCopy.c_strokeColor.value[1] = action.color.g;
    stateCopy.c_strokeColor.value[2] = action.color.b;
    return stateCopy;
}

// update state color model to RGB from frontend RGB
// always takes in {r:, g:,b:} type and returns { type: ,value: ,alpha: }
function convertRGBtoRGB(colorObj) {
    return colorObj.rgba;
}

function convertRGBtoHSL(colorObj) {
    // return
    console.log("convert rgb to hsl");
    let {r, g, b} = colorObj;
    let max, min;
    r = r / 255;
    g = g / 255;
    b = b / 255;

    max = Math.max(r, g, b);
    min = Math.min(r, g, b);

    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }
    // console.log([h, s, l]);
    return [ h, s, l ];
    // return 0;
}

// rgb to cmyk conversion from: https://www.rapidtables.com/convert/color/rgb-to-cmyk.html
function convertRGBtoCMYK(colorObj) {
    // return
    let r, g, b, rPrime, gPrime, bPrime, c, m, y, k;
    r = colorObj.r;
    g = colorObj.g;
    b = colorObj.b;

    // Convert from 0-255 range to 0-1
    rPrime = r / 255.0;
    gPrime = g / 255.0;
    bPrime = b / 255.0;

    // Calculate CMYK values
    k = 1 - Math.max(rPrime, gPrime, bPrime);
    c = (1 - rPrime - k) / (1 - k);
    m = (1 - gPrime - k) / (1 - k);
    y = (1 - bPrime - k) / (1 - k);

    console.log("convert rgb to cmyk");
    console.log([c.toFixed(2), m.toFixed(2), y.toFixed(2), k.toFixed(2)]);

    return [c.toFixed(2), m.toFixed(2), y.toFixed(2), k.toFixed(2)];
}

// decimal to HEX conversion from: https://gist.github.com/agirorn/0e740d012b620968225de58859ccef5c
function convertRGBtoHEX(colorObj) {
    // return
    console.log("convert rgb to hex");
    let r, g, b, rHex, gHex, bHex, hex;
    r = colorObj.r;
    g = colorObj.g;
    b = colorObj.b;

    rHex = (r + 0x10000).toString(16).substr(-2).toUpperCase();
    gHex = (g + 0x10000).toString(16).substr(-2).toUpperCase();
    bHex = (b + 0x10000).toString(16).substr(-2).toUpperCase();

    hex = "#" + rHex + gHex + bHex;
    console.log(hex);
    return hex;
}

// update state color model
export function convertColor(stateCopy, colorObj) {
    let cColor;
    if (stateCopy.docColorMode === "RGB") {
        cColor = convertRGBtoRGB(colorObj);
    } else if (stateCopy.docColorMode === "CMYK") {
        cColor = convertRGBtoCMYK(colorObj);
    } else if (stateCopy.docColorMode === "HSL") {
        cColor = convertRGBtoHSL(colorObj);
    } else {
        cColor = convertRGBtoHEX(colorObj);
    }
    return cColor;
}
