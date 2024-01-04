type HasId = { id: string | number };

export function updateCollectionItem<T>(
    collection: (T & HasId)[],
    updatedItem: T & HasId,
) {
    const newCollection = [...collection];
    const idx = newCollection.findIndex((i) => i.id === updatedItem.id);

    if (idx === -1) {
        newCollection.push(updatedItem);
    } else {
        newCollection[idx] = updatedItem;
    }

    return newCollection;
}
