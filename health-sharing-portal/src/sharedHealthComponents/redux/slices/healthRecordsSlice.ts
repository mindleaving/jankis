import { Action, ActionCreator, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit";
import { ViewModels } from "../../../localComponents/types/viewModels";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadObject } from "../../../sharedCommonComponents/helpers/LoadingHelpers";
import { RootState } from "../store/healthRecordStore";
import { setAdmissions } from "./admissionsSlice";
import { setDiagnoses } from "./diagnosesSlice";
import { setDocuments } from "./documentsSlice";
import { setMedicalProcedures } from "./medicalProceduresSlice";
import { setMedicationDispensions } from "./medicationDispensionsSlice";
import { setMedicationSchedules } from "./medicationSchedulesSlice";
import { setNotes } from "./notesSlice";
import { setObservations } from "./observationsSlice";
import { addPerson } from "./personsSlice";
import { setQuestionnaireAnswers } from "./questionnaireAnswersSlice";
import { setTestResults } from "./testResultsSlice";

interface HealthRecordsState {
    isLoading: boolean;
};
const initialState: HealthRecordsState = {
    isLoading: false
};
const healthRecordsSlice = createSlice({
    name: 'healthRecords',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        }
    }
});

type AsyncActionCreator = ActionCreator<ThunkAction<Promise<void>, RootState, void, Action>>
export const fetchHealthRecordForPerson: AsyncActionCreator = (personId: string) => {
    return async (dispatch) => {
        dispatch(setIsLoading(true));
        await loadObject<ViewModels.PatientOverviewViewModel>(
            `api/viewmodels/healthdata/${personId}`,
            {},
            resolveText('HealthData_CouldNotLoad'),
            vm => {
                dispatch(addPerson(vm.profileData));
                dispatch(setAdmissions(vm.admissions));
                dispatch(setNotes(vm.notes));
                dispatch(setDiagnoses(vm.diagnoses));
                dispatch(setMedicationSchedules(vm.medicationSchedules));
                dispatch(setMedicationDispensions(vm.medicationDispensions));
                dispatch(setObservations(vm.observations));
                dispatch(setTestResults(vm.testResults));
                dispatch(setMedicalProcedures(vm.medicalProcedures));
                dispatch(setDocuments(vm.documents));
                dispatch(setQuestionnaireAnswers(vm.questionnaires));
            },
            () => dispatch(setIsLoading(false))
        );
    }
}

export const { setIsLoading } = healthRecordsSlice.actions; 
export default healthRecordsSlice.reducer;