import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { distinct } from "../../../sharedCommonComponents/helpers/CollectionHelpers";
import { RemoteState } from "../../../sharedHealthComponents/types/reduxInterfaces";
import { Models } from "../../types/models";

export interface ServicesState extends RemoteState<Models.Services.ServiceDefinition> {
}

const initialState: ServicesState = {
    items: [],
    isLoading: false,
    isSubmitting: false
};

export const servicesSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setServices: (state, action: PayloadAction<Models.Services.ServiceDefinition[]>) => {
            state.items = action.payload;
        },
        addServices: (state, action: PayloadAction<Models.Services.ServiceDefinition[]>) => {
            state.items = distinct(state.items.concat(action.payload));
        },
        addOrUpdateService: (state, action: PayloadAction<Models.Services.ServiceDefinition>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        }
    }
});