import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ViewModels } from "../../../localComponents/types/viewModels";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadObject } from "../../../sharedCommonComponents/helpers/LoadingHelpers";
import { AsyncActionCreator } from "../../types/reduxTypes";
import { admissionsSlice } from "./admissionsSlice";
import { diagnosesSlice } from "./diagnosesSlice";
import { documentsSlice } from "./documentsSlice";
import { medicalProceduresSlice } from "./medicalProceduresSlice";
import { medicationDispensionsSlice } from "./medicationDispensionsSlice";
import { medicationSchedulesSlice } from "./medicationSchedulesSlice";
import { notesSlice } from "./notesSlice";
import { observationsSlice } from "./observationsSlice";
import { personsSlice } from "./personsSlice";
import { questionnaireAnswersSlice } from "./questionnaireAnswersSlice";
import { testResultsSlice } from "./testResultsSlice";

interface HealthRecordsState {
    isLoading: boolean;
    personId?: string;
};
const initialState: HealthRecordsState = {
    isLoading: false
};
export const healthRecordsSlice = createSlice({
    name: 'healthRecords',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setPersonId: (state, action: PayloadAction<string>) => {
            state.personId = action.payload;
        }
    }
});

export const fetchHealthRecordForPerson: AsyncActionCreator = (personId: string) => {
    return async (dispatch, getState) => {
        const state = getState();
        if(state.healthRecords.personId === personId) {
            return;
        }
        dispatch(healthRecordsSlice.actions.setIsLoading(true));
        await loadObject<ViewModels.PatientOverviewViewModel>(
            `api/viewmodels/healthdata/${personId}`,
            {},
            resolveText('HealthData_CouldNotLoad'),
            vm => {
                dispatch(personsSlice.actions.addPerson(vm.profileData));
                dispatch(admissionsSlice.actions.setAdmissions(vm.admissions));
                dispatch(notesSlice.actions.setNotes(vm.notes));
                dispatch(diagnosesSlice.actions.setDiagnoses(vm.diagnoses));
                dispatch(medicationSchedulesSlice.actions.setMedicationSchedules(vm.medicationSchedules));
                dispatch(medicationDispensionsSlice.actions.setMedicationDispensions(vm.medicationDispensions));
                dispatch(observationsSlice.actions.setObservations(vm.observations));
                dispatch(testResultsSlice.actions.setTestResults(vm.testResults));
                dispatch(medicalProceduresSlice.actions.setMedicalProcedures(vm.medicalProcedures));
                dispatch(documentsSlice.actions.setDocuments(vm.documents));
                dispatch(questionnaireAnswersSlice.actions.setQuestionnaireAnswers(vm.questionnaires));
                dispatch(healthRecordsSlice.actions.setPersonId(vm.profileData.id));
            },
            () => dispatch(healthRecordsSlice.actions.setIsLoading(false))
        );
    }
}