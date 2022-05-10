import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { RemoteState } from "../../types/reduxInterfaces";
import { ApiGetPersonDataActionCreator, ApiPostActionCreator } from "../../types/reduxTypes";
import { loadActionBuilder, loadPersonDataActionBuilder, postActionBuilder } from "../helpers/ActionCreatorBuilder";

interface AdmissionsState extends RemoteState<Models.Admission> {
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
        addOrUpdateAdmission: (state, action: PayloadAction<Models.Admission>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        }
    }
});

export const loadAdmissions = loadPersonDataActionBuilder(
    personId => `api/persons/${personId}/admissions`,
    () => resolveText("Admissions_CouldNotLoad"),
    admissionsSlice.actions.setIsLoading,
    admissionsSlice.actions.setAdmissions
);

export const loadAdmission = loadActionBuilder(
    args => `api/admissions/${args}`,
    () => resolveText("Admission_CouldNotLoad"),
    admissionsSlice.actions.setIsLoading,
    admissionsSlice.actions.addOrUpdateAdmission
);

export const addAdmission: ApiPostActionCreator<Models.Admission, Models.Admission> = postActionBuilder(
    () => `api/admissions`,
    () => resolveText("Admissions_CouldNotStore"),
    admissionsSlice.actions.setIsSubmitting,
    admissionsSlice.actions.addOrUpdateAdmission
);