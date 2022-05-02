import { AnyAction, configureStore } from '@reduxjs/toolkit';
import thunkMiddleware, { ThunkDispatch } from 'redux-thunk';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import personsReducer from '../slices/personsSlice';
import diagnosesReducer from '../slices/diagnosesSlice';
import observationsReducer from '../slices/observationsSlice';
import medicationSchedulesReducer from '../slices/medicationSchedulesSlice';
import medicationDispensionsReducer from '../slices/medicationDispensionsSlice';
import testResultsReducer from '../slices/testResultsSlice';
import notesReducer from '../slices/notesSlice';
import documentsReducer from '../slices/documentsSlice';
import medicalProceduresReducer from '../slices/medicalProceduresSlice';
import questionnaireAnswersReducer from '../slices/questionnaireAnswersSlice';
import healthRecordsReducer from '../slices/healthRecordsSlice';

const healthRecordStore = configureStore({
    reducer: {
        persons: personsReducer,
        diagnoses: diagnosesReducer,
        observations: observationsReducer,
        testResults: testResultsReducer,
        medicationSchedules: medicationSchedulesReducer,
        medicationDispensions: medicationDispensionsReducer,
        notes: notesReducer,
        documents: documentsReducer,
        medicalProcedures: medicalProceduresReducer,
        questionnaireAnswers: questionnaireAnswersReducer,
        healthRecords: healthRecordsReducer
    },
    middleware: (getDefaultMiddleware) => [thunkMiddleware, ...getDefaultMiddleware()]
});

export type RootState = ReturnType<typeof healthRecordStore.getState>;
export type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default healthRecordStore;