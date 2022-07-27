import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadObject } from "../../../sharedCommonComponents/helpers/LoadingHelpers";
import { admissionsSlice } from "../../../sharedHealthComponents/redux/slices/admissionsSlice";
import { diagnosesSlice } from "../../../sharedHealthComponents/redux/slices/diagnosesSlice";
import { documentsSlice } from "../../../sharedHealthComponents/redux/slices/documentsSlice";
import { healthRecordsSlice } from "../../../sharedHealthComponents/redux/slices/healthRecordsSlice";
import { immunizationsSlice } from "../../../sharedHealthComponents/redux/slices/immunizationsSlice";
import { medicalProceduresSlice } from "../../../sharedHealthComponents/redux/slices/medicalProceduresSlice";
import { medicationDispensionsSlice } from "../../../sharedHealthComponents/redux/slices/medicationDispensionsSlice";
import { medicationSchedulesSlice } from "../../../sharedHealthComponents/redux/slices/medicationSchedulesSlice";
import { notesSlice } from "../../../sharedHealthComponents/redux/slices/notesSlice";
import { observationsSlice } from "../../../sharedHealthComponents/redux/slices/observationsSlice";
import { personsSlice } from "../../../sharedHealthComponents/redux/slices/personsSlice";
import { questionnaireAnswersSlice } from "../../../sharedHealthComponents/redux/slices/questionnaireAnswersSlice";
import { testResultsSlice } from "../../../sharedHealthComponents/redux/slices/testResultsSlice";
import { ApiGetPersonDataActionCreator } from "../../../sharedHealthComponents/types/reduxTypes";
import { ViewModels } from "../../types/viewModels";

export const fetchHealthRecordForPerson: ApiGetPersonDataActionCreator<ViewModels.HealthRecordViewModel> = (args) => {
    return async (dispatch, getState) => {
        const state = getState();
        if(state.healthRecords.personId === args.personId) {
            return;
        }
        dispatch(healthRecordsSlice.actions.setIsLoading(true));
        await loadObject<ViewModels.HealthRecordViewModel>(
            `api/viewmodels/healthdata/${args.personId}`,
            {},
            resolveText('HealthData_CouldNotLoad'),
            vm => {
                dispatch(personsSlice.actions.addOrUpdatePerson(vm.profileData));
                dispatch(admissionsSlice.actions.setAdmissions(vm.admissions));
                dispatch(notesSlice.actions.setNotes(vm.notes));
                dispatch(diagnosesSlice.actions.setDiagnoses(vm.diagnoses));
                dispatch(medicationSchedulesSlice.actions.setMedicationSchedules(vm.medicationSchedules));
                dispatch(medicationDispensionsSlice.actions.setMedicationDispensions(vm.medicationDispensions));
                dispatch(immunizationsSlice.actions.setImmunizations(vm.immunizations));
                dispatch(observationsSlice.actions.setObservations(vm.observations));
                dispatch(testResultsSlice.actions.setTestResults(vm.testResults));
                dispatch(medicalProceduresSlice.actions.setMedicalProcedures(vm.medicalProcedures));
                dispatch(documentsSlice.actions.setDocuments(vm.documents));
                dispatch(questionnaireAnswersSlice.actions.setQuestionnaireAnswers(vm.questionnaires));
                dispatch(healthRecordsSlice.actions.setPersonId(vm.profileData.id));
                // TODO:
                // setBedOccupancy(vm.currentBedOccupancy);
                // setSubscription(vm.subscription);
                if(args.onSuccess) {
                    args.onSuccess(vm);
                }
            },
            () => {
                if(args.onFailure) {
                    args.onFailure();
                }
            },
            () => dispatch(healthRecordsSlice.actions.setIsLoading(false))
        );
    }
}