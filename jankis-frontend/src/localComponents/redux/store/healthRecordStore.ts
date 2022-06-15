import { AnyAction, configureStore, combineReducers, ActionCreator, Action, Reducer } from '@reduxjs/toolkit';
import thunkMiddleware, { ThunkDispatch } from 'redux-thunk';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { personsSlice } from '../../../sharedHealthComponents/redux/slices/personsSlice';
import { diagnosesSlice } from '../../../sharedHealthComponents/redux/slices/diagnosesSlice';
import { observationsSlice } from '../../../sharedHealthComponents/redux/slices/observationsSlice';
import { testResultsSlice } from '../../../sharedHealthComponents/redux/slices/testResultsSlice';
import { medicationSchedulesSlice } from '../../../sharedHealthComponents/redux/slices/medicationSchedulesSlice';
import { medicationDispensionsSlice } from '../../../sharedHealthComponents/redux/slices/medicationDispensionsSlice';
import { notesSlice } from '../../../sharedHealthComponents/redux/slices/notesSlice';
import { documentsSlice } from '../../../sharedHealthComponents/redux/slices/documentsSlice';
import { medicalProceduresSlice } from '../../../sharedHealthComponents/redux/slices/medicalProceduresSlice';
import { questionnaireAnswersSlice } from '../../../sharedHealthComponents/redux/slices/questionnaireAnswersSlice';
import { healthRecordsSlice } from '../../../sharedHealthComponents/redux/slices/healthRecordsSlice';
import { admissionsSlice } from '../../../sharedHealthComponents/redux/slices/admissionsSlice';
import { attachedEquipmentsSlice } from '../slices/attachedEquipmentsSlice';
import { subscriptionsSlice } from '../slices/subscriptionsSlice';
import { immunizationsSlice } from '../../../sharedHealthComponents/redux/slices/immunizationsSlice';
import { institutionsSlice } from '../slices/institutionsSlice';
import { stocksSlice } from '../slices/stocksSlice';
import { consumablesSlice } from '../slices/consumablesSlice';
import { resourcesSlice } from '../slices/resourcesSlice';
import { bedOccupanciesSlice } from '../slices/bedOccupanciesSlice';
import { departmentsSlice } from '../slices/departmentsSlice';
import { roomsSlice } from '../slices/roomsSlice';
import { newsSlice } from '../slices/newsSlice';

const appReducer = combineReducers({
    persons: personsSlice.reducer,
    admissions: admissionsSlice.reducer,
    diagnoses: diagnosesSlice.reducer,
    observations: observationsSlice.reducer,
    testResults: testResultsSlice.reducer,
    medicationSchedules: medicationSchedulesSlice.reducer,
    medicationDispensions: medicationDispensionsSlice.reducer,
    immunizations: immunizationsSlice.reducer,
    notes: notesSlice.reducer,
    documents: documentsSlice.reducer,
    medicalProcedures: medicalProceduresSlice.reducer,
    questionnaireAnswers: questionnaireAnswersSlice.reducer,
    attachedEquipments: attachedEquipmentsSlice.reducer,
    subscriptions: subscriptionsSlice.reducer,
    healthRecords: healthRecordsSlice.reducer,
    
    institutions: institutionsSlice.reducer,
    departments: departmentsSlice.reducer,
    rooms: roomsSlice.reducer,
    bedOccupancies: bedOccupanciesSlice.reducer,
    stocks: stocksSlice.reducer,
    consumables: consumablesSlice.reducer,
    resources: resourcesSlice.reducer,
    news: newsSlice.reducer
});
const rootReducer: Reducer<ReturnType<typeof appReducer>>  = (state, action) => {
    if(action.type === resetActionType) {
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
};
const resetActionType = "root/reset";
export const reset: ActionCreator<Action> = () => {
    return {
        type: resetActionType
    };
}


const healthRecordStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [thunkMiddleware, ...getDefaultMiddleware()]
});

export type RootState = ReturnType<typeof healthRecordStore.getState>;
export type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default healthRecordStore;