import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { distinct } from "../../../sharedCommonComponents/helpers/CollectionHelpers";
import { RemoteState } from "../../../sharedHealthComponents/types/reduxInterfaces";
import { Models } from "../../types/models";

export interface ResourcesState extends RemoteState<Models.Resource> {
}

const initialState: ResourcesState = {
    items: [],
    isLoading: false,
    isSubmitting: false
};
export const resourcesSlice = createSlice({
    name: 'resources',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setResources: (state, action: PayloadAction<Models.Resource[]>) => {
            state.items = action.payload;
        },
        addResources: (state, action: PayloadAction<Models.Resource[]>) => {
            state.items = distinct(state.items.concat(action.payload));
        },
        addOrUpdateResource: (state, action: PayloadAction<Models.Resource>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        }
    }
});