import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadActionBuilder, postActionBuilder } from "../../../sharedHealthComponents/redux/helpers/ActionCreatorBuilder";
import { RemoteState } from "../../../sharedHealthComponents/types/reduxInterfaces";
import { Models } from "../../types/models";

export interface InstitutionsState extends RemoteState<Models.Institution> {
}

const initialState: InstitutionsState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}


export const institutionsSlice = createSlice({
    name: 'institutions',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setInstitutions: (state, action: PayloadAction<Models.Institution[]>) => {
            state.items = action.payload;
        },
        addOrUpdateInstitution: (state, action: PayloadAction<Models.Institution>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        }
    }
});

export const loadInsitutions = loadActionBuilder(
    () => `api/institutions`,
    () => resolveText("Institutions_CouldNotLoad"),
    institutionsSlice.actions.setIsLoading,
    institutionsSlice.actions.setInstitutions
);
export const loadInsitution = loadActionBuilder(
    args => `api/institutions/${args}`,
    () => resolveText("Institution_CouldNotLoad"),
    institutionsSlice.actions.setIsLoading,
    institutionsSlice.actions.addOrUpdateInstitution
);
export const addOrUpdateInstitution = postActionBuilder(
    () => `api/institutions`,
    () => resolveText("Institution_CouldNotStore"),
    institutionsSlice.actions.setIsSubmitting,
    institutionsSlice.actions.addOrUpdateInstitution
);