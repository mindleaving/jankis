export namespace MedicalCommands {
    interface CommandPart {
        type: CommandPartType;
        action?: (commandParts: string[]) => void;
        contextCommands: CommandPart[];
    }
    interface KeywordCommandPart extends CommandPart {
        value: string;
    }
    interface ObjectReferenceCommandPart extends CommandPart {
        autocompleteUrl: string;
    }
    interface PatternCommandPart extends CommandPart {
        pattern: string;
    }
}