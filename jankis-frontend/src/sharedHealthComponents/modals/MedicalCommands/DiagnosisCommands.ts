import { HealthRecordEntryType } from "../../../localComponents/types/enums.d";
import { Models } from "../../../localComponents/types/models";
import { CommandPartType } from "../../types/medicalCommandEnums";
import { v4 as uuid } from 'uuid';
import { MedicalCommands } from "../../types/medicalCommandTypes";
import { ViewModels } from "../../../localComponents/types/viewModels";
import { getObjectReferenceValue } from "../../helpers/MedicalCommandHelpers";
import { AppDispatch } from "../../../localComponents/redux/store/healthRecordStore";
import { addDiagnosis, markDiagnosisAsResolved } from "../../redux/slices/diagnosesSlice";

export class DiagnosisCommands {

    personId: string;
    user: ViewModels.IUserViewModel;
    navigate: (path: string) => void;
    dispatch: AppDispatch;
    
    addDiagnosis = async (commandParts: MedicalCommands.SelectedCommandPart[]) => {
        const icdCategory = getObjectReferenceValue<Models.Icd.IcdCategory>(commandParts, "IcdCategory");
        const diagnosis: ViewModels.DiagnosisViewModel = {
            id: uuid(),
            type: HealthRecordEntryType.Diagnosis,
            createdBy: this.user.accountId,
            timestamp: new Date(),
            isVerified: false,
            hasBeenSeenBySharer: this.user.profileData.id === this.personId,
            personId: this.personId,
            icd11Code: icdCategory!.code,
            hasResolved: false,
            name: icdCategory!.name
        };
        let isSuccess = false;
        this.dispatch(addDiagnosis({
            args: diagnosis,
            body: diagnosis,
            onSuccess: () => isSuccess = true
        }));
        return isSuccess;
    }
    resolveDiagnosis = async (commandParts: MedicalCommands.SelectedCommandPart[]) => {
        const diagnosis = getObjectReferenceValue<ViewModels.DiagnosisViewModel>(commandParts, "Diagnosis");
        const diagnosisId = diagnosis!.id;
        let isSuccess = false;
        this.dispatch(markDiagnosisAsResolved({
            args: diagnosisId,
            body: null,
            onSuccess: () => isSuccess = true
        }));
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
        user: ViewModels.IUserViewModel, 
        navigate: (path: string) => void,
        dispatch: AppDispatch) {
            this.personId = personId;
            this.user = user;
            this.navigate = navigate;
            this.dispatch = dispatch;
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