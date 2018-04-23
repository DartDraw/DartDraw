export const CONVERT_RGB = 'CONVERT_RGB';

export function convertFromRGB(color) {
    return { type: CONVERT_RGB, payload: { color } };
}
