export function setGrid(stateCopy, action) {
    const { unitType, majorGrid, minorGrid } = action.payload;

    // NEED LOGIC TO CONVER FROM UNIT TYPE TO GENERIC TYPE

    stateCopy.unitType = unitType;
    stateCopy.majorGrid = majorGrid;
    stateCopy.minorGrid = minorGrid;

    return stateCopy;
}
