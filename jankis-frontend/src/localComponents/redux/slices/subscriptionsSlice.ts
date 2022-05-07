import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RemoteState } from "../../../sharedHealthComponents/types/reduxInterfaces";
import { Models } from "../../types/models";

export interface SubscriptionsState extends RemoteState<Models.Subscriptions.SubscriptionBase> {
}
const initialState: SubscriptionsState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}

export const subscriptionsSlice = createSlice({
    name: 'subscriptions',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setSubscriptions: (state, action: PayloadAction<Models.Subscriptions.SubscriptionBase[]>) => {
            state.items = action.payload
        }
    }
});

