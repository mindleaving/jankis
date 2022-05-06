import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadObject } from "../../../sharedCommonComponents/helpers/LoadingHelpers";
import { sendPostRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { RemoteState } from "../../types/reduxInterfaces";
import { AsyncActionCreator } from "../../types/reduxTypes";

interface AdmissionsState extends RemoteState {
    items: Models.Admission[];
}
const initialState: AdmissionsState = {
    items: [],
    isLoading: false,
    isSubmitting: false
};

export const admissionsSlice = createSlice({
    name: 'admissions',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setAdmissions: (state, action: PayloadAction<Models.Admission[]>) => {
            state.items = action.payload;
        },
        addAdmission : (state, action: PayloadAction<Models.Admission>) => {
            state.items.push(action.payload);
        }
    }
});

export const loadAdmissions: AsyncActionCreator = (personId: string) => {
    return async (dispatch) => {
        dispatch(admissionsSlice.actions.setIsLoading(true));
        await loadObject<Models.Admission[]>(
            `api/persons/${personId}/admissions`, { },
            resolveText("Admissions_CouldNotLoad"),
            admissions => {
                dispatch(admissionsSlice.actions.setAdmissions(admissions));
            },
            () => dispatch(admissionsSlice.actions.setIsLoading(false))
        );
    }
}

export const addAdmission: AsyncActionCreator = (admission: Models.Admission) => {
    return async (dispatch) => {
        dispatch(admissionsSlice.actions.setIsSubmitting(true));
        await sendPostRequest(
            `api/admissions`,
            resolveText("Admissions_CouldNotStore"),
            admission,
            () => dispatch(admissionsSlice.actions.addAdmission(admission)),
            () => dispatch(admissionsSlice.actions.setIsSubmitting(false))
        );
    }
}