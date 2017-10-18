export function calculateBoundingBox(shape, shapes, group) {
    shape.members.map((id) => {
        let member = shapes.byId[id];
        if (member.type === "group") {
            group = calculateBoundingBox(member, shapes, group);
        } else {
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
        }
    });
    return group;
}
