export namespace MedicalCommands {
    interface CommandPart {
        type: CommandPartType;
        description?: string;
        action?: (commandParts: string[]) => void;
        contextCommands: CommandPart[];
    }
    interface KeywordCommandPart extends CommandPart {
        keywords: string[];
    }
    interface ObjectReferenceCommandPart extends CommandPart {
        autocompleteUrl: string;
    }
    interface PatternCommandPart extends CommandPart {
        pattern: string;
    }
    interface FreeTextCommandPart extends CommandPart {
        
    }
}