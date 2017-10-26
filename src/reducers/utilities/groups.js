export function calculateBoundingBox(shape, shapes) {
    const group = { x: Infinity, x2: -Infinity, y: Infinity, y2: -Infinity };
    shape.members.map((id) => {
        let member = shapes.byId[id];

        if (member.type === "line") {
            // give recangle parameters
            member.width = member.x2 - member.x1;
            member.height = member.y2 - member.y1;
            member.x = member.x1;
            member.y = member.y1;
        }

        if (member.width >= 0) {
            if (member.x < group.x) { group.x = member.x; }
            if (member.x + member.width > group.x2) { group.x2 = member.x + member.width; }
        } else {
            if (member.x + member.width < group.x) { group.x = member.x + member.width; }
            if (member.x > group.x2) { group.x2 = member.x; }
        }
        if (member.height >= 0) {
            if (member.y < group.y) { group.y = member.y; }
            if (member.y + member.height > group.y2) { group.y2 = member.y + member.height; }
        } else {
            if (member.y + member.height < group.y) { group.y = member.y + member.height; }
            if (member.y > group.y2) { group.y2 = member.y; }
        }
    });
    return group;
}
