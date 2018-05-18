export const CONVERT_RGB = 'CONVERT_RGB';
export const CONVERT_COLOR = 'CONVERT_COLOR';

export function convertFromRGB(color) {
    return { type: CONVERT_RGB, payload: { color } };
}

export function convertColorDef(color) {
    return {type: CONVERT_COLOR, payload: { color }};
}
