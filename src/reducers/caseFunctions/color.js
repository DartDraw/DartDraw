export function convertToRGBfromRGB(stateCopy, action) {
    stateCopy.c_strokeColor.value[0] = action.color.r;
    stateCopy.c_strokeColor.value[1] = action.color.g;
    stateCopy.c_strokeColor.value[2] = action.color.b;
    console.log();
    return stateCopy;
}
