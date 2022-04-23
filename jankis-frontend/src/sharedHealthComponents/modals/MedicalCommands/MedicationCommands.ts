import { CommandPartType } from "../../types/medicalCommandEnums";
import { MedicalCommands } from "../../types/medicalCommandTypes";
import { sendPostRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { getObjectReferenceValue } from "../../helpers/MedicalCommandHelpers";
import { Models } from "../../../localComponents/types/models";
import { formatDrug } from "../../helpers/Formatters";
import { ViewModels } from "../../../localComponents/types/viewModels";

export class MedicationCommands {
    personId: string;
    user: ViewModels.IUserViewModel;
    navigate: (path: string) => void;
    commandHierarchy: MedicalCommands.CommandPart;

    addMedication = async (commandParts: MedicalCommands.SelectedCommandPart[]) => {
        const drug = getObjectReferenceValue<Models.Medication.Drug>(commandParts, "Drug");
        const drugId = drug!.id;
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

    pauseMedication = async (commandParts: MedicalCommands.SelectedCommandPart[]) => {
        const medication = getObjectReferenceValue<Models.Medication.MedicationScheduleItem>(commandParts, "Medication");
        const medicationId = medication!.id;
        let isSuccess = false;
        sendPostRequest(
            `api/persons/${this.personId}/medications/${medicationId}/pause`,
            resolveText("Medication_CouldNotPause"),
            null,
            response => isSuccess = response.ok
        );
        return isSuccess;
    }

    removeMedication = async (commandParts: MedicalCommands.SelectedCommandPart[]) => {
        const medication = getObjectReferenceValue<Models.Medication.MedicationScheduleItem>(commandParts, "Medication");
        const medicationId = medication!.id;
        let isSuccess = false;
        sendPostRequest(
            `api/persons/${this.personId}/medications/${medicationId}/stop`,
            resolveText("Medication_CouldNotRemove"),
            null,
            response => isSuccess = response.ok
        );
        return isSuccess;
    }

    

    constructor(
        personId: string, 
        user: ViewModels.IUserViewModel, 
        navigate: (path: string) => void) {
            this.personId = personId;
            this.user = user;
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
                                description: 'Drug',
                                objectType: 'Drug',
                                autocompleteUrl: 'api/drugs',
                                searchParameter: 'searchText',
                                displayFunc: formatDrug,
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
                                description: 'Medication',
                                objectType: 'Medication',
                                autocompleteUrl: `api/persons/${this.personId}/medications`,
                                searchParameter: 'searchText',
                                displayFunc: (medication: Models.Medication.MedicationScheduleItem) => formatDrug(medication.drug),
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
                                description: 'Medication',
                                objectType: 'Medication',
                                autocompleteUrl: `api/persons/${this.personId}/medications`,
                                searchParameter: 'searchText',
                                displayFunc: (medication: Models.Medication.MedicationScheduleItem) => formatDrug(medication.drug),
                                action: this.pauseMedication,
                                contextCommands: []
                            } as MedicalCommands.ObjectReferenceCommandPart
                        ]
                    }
                ] as MedicalCommands.KeywordCommandPart[]
            } as MedicalCommands.KeywordCommandPart;
    }
}