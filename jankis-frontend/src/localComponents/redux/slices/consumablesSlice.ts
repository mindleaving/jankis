import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { distinct } from "../../../sharedCommonComponents/helpers/CollectionHelpers";
import { RemoteState } from "../../../sharedHealthComponents/types/reduxInterfaces";
import { Models } from "../../types/models";

export interface ConsumablesState extends RemoteState<Models.Consumable> {
}

const initialState: ConsumablesState = {
    items: [],
    isLoading: false,
    isSubmitting: false
};
export const consumablesSlice = createSlice({
    name: 'consumables',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setConsumables: (state, action: PayloadAction<Models.Consumable[]>) => {
            state.items = action.payload;
        },
        addConsumables: (state, action: PayloadAction<Models.Consumable[]>) => {
            state.items = distinct(state.items.concat(action.payload));
        },
        addOrUpdateConsumable: (state, action: PayloadAction<Models.Consumable>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        }
    }
});