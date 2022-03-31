export namespace MedicalCommands {
    interface CommandPart {
        type: CommandPartType;
        description?: string;
        action?: (commandParts: SelectedCommandPart[]) => Promise<boolean>;
        contextCommands: CommandPart[];
    }
    interface KeywordCommandPart extends CommandPart {
        keywords: string[];
    }
    interface ObjectReferenceCommandPart extends CommandPart {
        objectType: string;
        autocompleteUrl: string;
        searchParameter: string;
        displayFunc: (item: any) => string;
    }
    interface AutoCompleteCommandPart extends CommandPart {
        context: string;
    }
    interface PatternCommandPart extends CommandPart {
        pattern: string;
    }
    interface FreeTextCommandPart extends CommandPart {
        
    }

    interface SelectedCommandPart {
        commandPart: CommandPart;
        selectedValue: any;
    }
}