export function calculateBoundingBox(shape, shapes, group) {
    shape.members.map((id) => {
        let member = shapes.byId[id];
        if (member.type === "group") {
            group = calculateBoundingBox(member, shapes, group);
        } else {
            if (member.x < group.x) { group.x = member.x; }
            if (member.y < group.y) { group.y = member.y; }
            if (member.x + member.width > group.x2) { group.x2 = member.x + member.width; }
            if (member.y + member.height > group.y2) { group.y2 = member.y + member.height; }
        }
    });
    return group;
}
