export function setGrid(stateCopy, action) {
    const { unitType, majorGrid, minorGrid } = action.payload;

    // NEED LOGIC TO CONVERT FROM UNIT TYPE TO CANONICAL TYPE

    stateCopy.unitType = unitType;
    stateCopy.majorGrid = majorGrid;
    stateCopy.minorGrid = minorGrid;

    return stateCopy;
}

export function toggleGridSnapping(stateCopy) {
    stateCopy.gridSnapping = !stateCopy.gridSnapping;
    return stateCopy;
}
