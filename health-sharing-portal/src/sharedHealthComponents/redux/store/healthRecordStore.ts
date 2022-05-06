import { AnyAction, configureStore, combineReducers, ActionCreator, Action, Reducer } from '@reduxjs/toolkit';
import thunkMiddleware, { ThunkDispatch } from 'redux-thunk';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { personsSlice } from '../slices/personsSlice';
import { diagnosesSlice } from '../slices/diagnosesSlice';
import { observationsSlice } from '../slices/observationsSlice';
import { testResultsSlice } from '../slices/testResultsSlice';
import { medicationSchedulesSlice } from '../slices/medicationSchedulesSlice';
import { medicationDispensionsSlice } from '../slices/medicationDispensionsSlice';
import { notesSlice } from '../slices/notesSlice';
import { documentsSlice } from '../slices/documentsSlice';
import { medicalProceduresSlice } from '../slices/medicalProceduresSlice';
import { questionnaireAnswersSlice } from '../slices/questionnaireAnswersSlice';
import { healthRecordsSlice } from '../slices/healthRecordsSlice';

const appReducer = combineReducers({
    persons: personsSlice.reducer,
    diagnoses: diagnosesSlice.reducer,
    observations: observationsSlice.reducer,
    testResults: testResultsSlice.reducer,
    medicationSchedules: medicationSchedulesSlice.reducer,
    medicationDispensions: medicationDispensionsSlice.reducer,
    notes: notesSlice.reducer,
    documents: documentsSlice.reducer,
    medicalProcedures: medicalProceduresSlice.reducer,
    questionnaireAnswers: questionnaireAnswersSlice.reducer,
    healthRecords: healthRecordsSlice.reducer
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