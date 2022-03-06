import { IcdTreeViewEntry } from "../types/frontendtypes";
import { Models } from "../types/models";

export const getSelectedDiseaseCodes = (items: IcdTreeViewEntry[]): string[]  => {
    return items
        .filter(x => x.isSelected)
        .filter(item => (item as Models.Icd.IcdCategory)?.code !== undefined)
        .map(item => (item as Models.Icd.IcdCategory).code)
        .concat(items.flatMap(item => getSelectedDiseaseCodes(item.subEntries as IcdTreeViewEntry[])));
}