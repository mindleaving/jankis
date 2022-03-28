import { CommandPartType } from "../../types/medicalCommandEnums";
import { MedicalCommands } from "../../types/medicalCommandTypes";
import { sendPostRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";

export class MedicationCommands {
    personId: string;
    username: string;
    navigate: (path: string) => void;
    commandHierarchy: MedicalCommands.CommandPart;

    addMedication = async (commandParts: string[]) => {
        const drugId = commandParts[2];
        const dosage = commandParts[3];
        const dispensionPattern = commandParts[4];
        // const medication: Models.Medication.MedicationScheduleItemLight = {
        //     id: uuid(),
        //     drugId: drugId,
        //     dosage: dosage,
        //     dispensionPattern: dispensionPattern,
        //     isDispendedByPatient: true,
        //     isPaused: false,
        //     note: ''
        // };
        // sendPostRequest(
        //     `api/persons/${this.personId}/medications`,
        //     resolveText("Medication_CouldNotPause"),
        //     medication
        // );
    }

    pauseMedication = async (commandParts: string[]) => {
        const medicationId = commandParts[commandParts.length-1];
        sendPostRequest(
            `api/persons/${this.personId}/medications/${medicationId}/pause`,
            resolveText("Medication_CouldNotPause"),
            null
        );
    }

    removeMedication = async (commandParts: string[]) => {
        const medicationId = commandParts[commandParts.length-1];
        sendPostRequest(
            `api/persons/${this.personId}/medications/${medicationId}/stop`,
            resolveText("Medication_CouldNotRemove"),
            null
        );
    }

    

    constructor(
        personId: string, 
        username: string, 
        navigate: (path: string) => void) {
            this.personId = personId;
            this.username = username;
            this.navigate = navigate;
            this.commandHierarchy = {
                type: CommandPartType.Keyword,
                keywords: ['medication'],
                contextCommands: [
                    {
                        type: CommandPartType.Keyword,
                        keywords: ['add'],
                        contextCommands: [
                            {
                                type: CommandPartType.ObjectReference,
                                autocompleteUrl: 'api/drugs',
                                contextCommands: [
                                    {
                                        type: CommandPartType.Pattern,
                                        description: 'dosage',
                                        pattern: '[0-9]+\\s*[a-zA-Z0-9/^]+', // e.g. 200 mg
                                        contextCommands: [
                                            {
                                                type: CommandPartType.Pattern,
                                                description: 'frequency',
                                                pattern: '[0-9]+(-[0-9]+){2,3}', // e.g. 1-0-1
                                                contextCommands: []
                                            } as MedicalCommands.PatternCommandPart
                                        ]
                                    } as MedicalCommands.PatternCommandPart
                                ]
                            } as MedicalCommands.ObjectReferenceCommandPart
                        ]
                    },
                    {
                        type: CommandPartType.Keyword,
                        keywords: ['remove', 'stop'],
                        contextCommands: [
                            {
                                type: CommandPartType.ObjectReference,
                                autocompleteUrl: `api/persons/${this.personId}/medications`,
                                action: this.removeMedication,
                                contextCommands: []
                            } as MedicalCommands.ObjectReferenceCommandPart
                        ]
                    },
                    {
                        type: CommandPartType.Keyword,
                        keywords: ['pause'],
                        contextCommands: [
                            {
                                type: CommandPartType.ObjectReference,
                                autocompleteUrl: `api/persons/${this.personId}/medications`,
                                action: this.pauseMedication,
                                contextCommands: []
                            } as MedicalCommands.ObjectReferenceCommandPart
                        ]
                    }
                ] as MedicalCommands.KeywordCommandPart[]
            } as MedicalCommands.KeywordCommandPart;
    }
}