import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadObject } from "../../../sharedCommonComponents/helpers/LoadingHelpers";
import { sendPostRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { RemoteState } from "../../types/reduxInterfaces";
import { AsyncActionCreator } from "../../types/reduxTypes";

interface MedicalProceduresState extends RemoteState {
    items: Models.Procedures.MedicalProcedure[];
}

const initialState: MedicalProceduresState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}

export const medicalProceduresSlice = createSlice({
    name: 'medicalProcedures',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setMedicalProcedures: (state, action: PayloadAction<Models.Procedures.MedicalProcedure[]>) => {
            state.items = action.payload;
        },
        addMedicalProcedure : (state, action: PayloadAction<Models.Procedures.MedicalProcedure>) => {
            state.items.push(action.payload);
        }
    }
});

export const loadMedicalProcedures: AsyncActionCreator = (personId: string) => {
    return async (dispatch) => {
        dispatch(medicalProceduresSlice.actions.setIsLoading(true));
        await loadObject<Models.Procedures.MedicalProcedure[]>(
            `api/persons/${personId}/procedures`, {},
            resolveText("MedicalProcedures_CouldNotLoad"),
            medicalProcedures => dispatch(medicalProceduresSlice.actions.setMedicalProcedures(medicalProcedures)),
            () => dispatch(medicalProceduresSlice.actions.setIsLoading(false))
        );
    }
}
export const addMedicalProcedure: AsyncActionCreator = (medicalProcedure: Models.Procedures.MedicalProcedure) => {
    return async (dispatch) => {
        dispatch(medicalProceduresSlice.actions.setIsSubmitting(true));
        await sendPostRequest(
            `api/medicalProcedures`, 
            resolveText("MedicalProcedure_CouldNotStore"),
            medicalProcedure,
            () => dispatch(medicalProceduresSlice.actions.addMedicalProcedure(medicalProcedure)),
            () => dispatch(medicalProceduresSlice.actions.setIsSubmitting(false))
        );
    }
}