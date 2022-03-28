import { resolveText } from "../../sharedCommonComponents/helpers/Globalizer";
import { CommandPartType } from "../types/medicalCommandEnums";
import { MedicalCommands } from "../types/medicalCommandTypes";

export const formatCommandPart = (commandPart: MedicalCommands.CommandPart) => {
    if(!commandPart) {
        return '';
    }
    if(commandPart.description) {
        return commandPart.description;
    }
    switch(commandPart.type) {
        case CommandPartType.Keyword:
            const keywordCommandPart = commandPart as MedicalCommands.KeywordCommandPart;
            return keywordCommandPart.keywords[0];
        case CommandPartType.FreeText:
            //const freeTextCommandPart = commandPart as MedicalCommands.FreeTextCommandPart;
            return resolveText("MedicalCommands_FreeText");
        case CommandPartType.ObjectReference:
            //const objectReferenceCommandPart = commandPart as MedicalCommands.ObjectReferenceCommandPart;
            return resolveText("MedicalCommands_ObjectReference");
        case CommandPartType.Pattern:
            const patternCommandPart = commandPart as MedicalCommands.PatternCommandPart;
            return `${resolveText("MedicalCommands_Pattern")}: ${patternCommandPart.pattern}`;
        default:
            throw new Error(`Unknown command part type '${commandPart.type}'`);
    }
}