import { HealthRecordEntryType } from "../../../localComponents/types/enums.d";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { sendPutRequest, sendPostRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { CommandPartType } from "../../types/medicalCommandEnums";
import { v4 as uuid } from 'uuid';
import { MedicalCommands } from "../../types/medicalCommandTypes";

export class DiagnosisCommands {

    personId: string;
    username: string;
    navigate: (path: string) => void;
    
    addDiagnosis = async (commandParts: string[]) => {
        const icd11Code = commandParts[commandParts.length-1];
        const diagnosis: Models.Diagnoses.Diagnosis = {
            id: uuid(),
            type: HealthRecordEntryType.Diagnosis,
            createdBy: this.username,
            timestamp: new Date(),
            personId: this.personId,
            icd11Code: icd11Code,
            hasResolved: false
        };
        await sendPutRequest(
            `api/diagnoses/${diagnosis.id}`,
            resolveText("Diagnosis_CouldNotCreate"),
            diagnosis
        );
    }
    resolveDiagnosis = async (commandParts: string[]) => {
        const diagnosisId = commandParts[commandParts.length-1];
        await sendPostRequest(
            `api/diagnoses/${diagnosisId}/resolve`,
            resolveText("Diagnosis_CouldNotMarkAsResolved"),
            null
        );
    }
    editDiagnosis = async (commandParts: string[]) => {
        const diagnosisId = commandParts[commandParts.length-1];
        this.navigate(`/healthrecord/${this.personId}/edit/diagnosis/${diagnosisId}`);
    }

    commandHierarchy: MedicalCommands.CommandPart = {
        type: CommandPartType.Keyword,
        keywords: ["diagnosis"],
        contextCommands: [
            {
                type: CommandPartType.Keyword,
                keywords: ["add"],
                contextCommands: [
                    {
                        type: CommandPartType.ObjectReference,
                        autocompleteUrl: 'api/classifications/icd11',
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
                        autocompleteUrl: 'api/diagnoses',
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
                        autocompleteUrl: 'api/diagnoses',
                        action: this.editDiagnosis,
                        contextCommands: []
                    } as MedicalCommands.ObjectReferenceCommandPart
                ]
            }
        ] as MedicalCommands.KeywordCommandPart[]
    } as MedicalCommands.KeywordCommandPart;

    constructor(
        personId: string, 
        username: string, 
        navigate: (path: string) => void) {
            this.personId = personId;
            this.username = username;
            this.navigate = navigate;
    }
}