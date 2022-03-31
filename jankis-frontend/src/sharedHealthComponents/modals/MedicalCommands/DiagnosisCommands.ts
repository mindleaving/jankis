import { HealthRecordEntryType } from "../../../localComponents/types/enums.d";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { sendPutRequest, sendPostRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { CommandPartType } from "../../types/medicalCommandEnums";
import { v4 as uuid } from 'uuid';
import { MedicalCommands } from "../../types/medicalCommandTypes";
import { ViewModels } from "../../../localComponents/types/viewModels";
import { getObjectReferenceValue } from "../../helpers/MedicalCommandHelpers";

export class DiagnosisCommands {

    personId: string;
    username: string;
    navigate: (path: string) => void;
    
    addDiagnosis = async (commandParts: MedicalCommands.SelectedCommandPart[]) => {
        const icdCategory = getObjectReferenceValue<Models.Icd.IcdCategory>(commandParts, "IcdCategory");
        const diagnosis: Models.Diagnoses.Diagnosis = {
            id: uuid(),
            type: HealthRecordEntryType.Diagnosis,
            createdBy: this.username,
            timestamp: new Date(),
            personId: this.personId,
            icd11Code: icdCategory!.code,
            hasResolved: false
        };
        let isSuccess = false;
        await sendPutRequest(
            `api/diagnoses/${diagnosis.id}`,
            resolveText("Diagnosis_CouldNotCreate"),
            diagnosis,
            response => isSuccess = response.ok
        );
        return isSuccess;
    }
    resolveDiagnosis = async (commandParts: MedicalCommands.SelectedCommandPart[]) => {
        const diagnosis = getObjectReferenceValue<ViewModels.DiagnosisViewModel>(commandParts, "Diagnosis");
        const diagnosisId = diagnosis!.id;
        let isSuccess = false;
        await sendPostRequest(
            `api/diagnoses/${diagnosisId}/resolve`,
            resolveText("Diagnosis_CouldNotMarkAsResolved"),
            null,
            response => isSuccess = response.ok
        );
        return isSuccess;
    }
    editDiagnosis = async (commandParts: MedicalCommands.SelectedCommandPart[]) => {
        const diagnosis = getObjectReferenceValue<ViewModels.DiagnosisViewModel>(commandParts, "Diagnosis");
        const diagnosisId = diagnosis!.id;
        this.navigate(`/healthrecord/${this.personId}/edit/diagnosis/${diagnosisId}`);
        return true;
    }

    commandHierarchy: MedicalCommands.CommandPart;

    constructor(
        personId: string, 
        username: string, 
        navigate: (path: string) => void) {
            this.personId = personId;
            this.username = username;
            this.navigate = navigate;
            this.commandHierarchy = {
                type: CommandPartType.Keyword,
                keywords: ["diagnosis"],
                contextCommands: [
                    {
                        type: CommandPartType.Keyword,
                        keywords: ["add"],
                        contextCommands: [
                            {
                                type: CommandPartType.ObjectReference,
                                description: 'ICD-11',
                                objectType: 'IcdCategory',
                                autocompleteUrl: 'api/classifications/icd11',
                                searchParameter: 'searchText',
                                displayFunc: (icdCategory: Models.Icd.IcdCategory) => `${icdCategory.code} (${icdCategory.name})`,
                                action: this.addDiagnosis,
                                contextCommands: []
                            } as MedicalCommands.ObjectReferenceCommandPart
                        ]
                    },
                    {
                        type: CommandPartType.Keyword,
                        keywords: ["resolve"],
                        contextCommands: [
                            {
                                type: CommandPartType.ObjectReference,
                                description: 'Diagnosis',
                                objectType: 'Diagnosis',
                                autocompleteUrl: `api/persons/${this.personId}/diagnoses`,
                                searchParameter: 'searchText',
                                displayFunc: (diagnosis: ViewModels.DiagnosisViewModel) => `${diagnosis.name} (ICD-11: ${diagnosis.icd11Code})`,
                                action: this.resolveDiagnosis,
                                contextCommands: []
                            } as MedicalCommands.ObjectReferenceCommandPart
                        ]
                    },
                    {
                        type: CommandPartType.Keyword,
                        keywords: ["edit"],
                        contextCommands: [
                            {
                                type: CommandPartType.ObjectReference,
                                description: 'Diagnosis',
                                objectType: 'Diagnosis',
                                autocompleteUrl: `api/persons/${this.personId}/diagnoses`,
                                searchParameter: 'searchText',
                                displayFunc: (diagnosis: ViewModels.DiagnosisViewModel) => `${diagnosis.name} (ICD-11: ${diagnosis.icd11Code})`,
                                action: this.editDiagnosis,
                                contextCommands: []
                            } as MedicalCommands.ObjectReferenceCommandPart
                        ]
                    }
                ] as MedicalCommands.KeywordCommandPart[]
            } as MedicalCommands.KeywordCommandPart;
    }
}