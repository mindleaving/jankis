import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { distinct } from "../../../sharedCommonComponents/helpers/CollectionHelpers";
import { RemoteState } from "../../../sharedHealthComponents/types/reduxInterfaces";
import { Models } from "../../types/models";

export interface StocksState extends RemoteState<Models.Stock> {
}

const initialState: StocksState = {
    items: [],
    isLoading: false,
    isSubmitting: false
};

export const stocksSlice = createSlice({
    name: 'stocks',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setStocks: (state, action: PayloadAction<Models.Stock[]>) => {
            state.items = action.payload;
        },
        addStocks: (state, action: PayloadAction<Models.Stock[]>) => {
            state.items = distinct(state.items.concat(action.payload));
        },
        addOrUpdateStock: (state, action: PayloadAction<Models.Stock>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        }
    }
});