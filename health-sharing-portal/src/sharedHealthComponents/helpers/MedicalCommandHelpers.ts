import { CommandPartType } from "../types/medicalCommandEnums";
import { MedicalCommands } from "../types/medicalCommandTypes";

export const getObjectReferenceValue = <T extends unknown>(selectedParts: MedicalCommands.SelectedCommandPart[], objectType: string) => {
    const matchingPart = selectedParts.find(x => 
        x.commandPart.type === CommandPartType.ObjectReference 
        && (x.commandPart as MedicalCommands.ObjectReferenceCommandPart).objectType === objectType);
    if(!matchingPart) {
        return undefined;
    }
    return matchingPart.selectedValue as T;
}