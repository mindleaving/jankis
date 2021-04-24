export const groupBy = <T extends unknown>(collection: T[], keySelector: (item: T) => string) => {
    const groups: { [k: string]: T[] } = {};
    for (const item of collection) {
        const key = keySelector(item);
        if(!groups[key]) {
            groups[key] = [];
        };
        groups[key].push(item);
    }
    return Object.keys(groups).map(key => ({
        key: key,
        items: groups[key]
    }));
}