import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { sendPostRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { postActionBuilder } from "../../../sharedHealthComponents/redux/helpers/ActionCreatorBuilder";
import { RemoteState } from "../../../sharedHealthComponents/types/reduxInterfaces";
import { AsyncActionCreator } from "../../../sharedHealthComponents/types/reduxTypes";
import { SubscriptionObjectType } from "../../types/enums";
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
        },
        addOrUpdateSubscription: (state, action: PayloadAction<Models.Subscriptions.SubscriptionBase>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        },
        removePatientSubscription: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(x => 
                x.type !== SubscriptionObjectType.Patient 
                || (x as Models.Subscriptions.PatientSubscription).personId !== action.payload
            );
        }
    }
});

export const subscribeToPerson: AsyncActionCreator = (personId: string) => {
    return async (dispatch) => {
        dispatch(subscriptionsSlice.actions.setIsSubmitting(true));
        await sendPostRequest(
            `api/patients/${personId}/subscribe`,
            resolveText("Patient_CouldNotSubscribe"),
            null,
            async response => {
                const subscription = await response.json() as Models.Subscriptions.PatientSubscription;
                dispatch(subscriptionsSlice.actions.addOrUpdateSubscription(subscription));
            },
            () => {},
            () => dispatch(subscriptionsSlice.actions.setIsSubmitting(false))
        );
    }
}
export const unsubscribeFromPerson: AsyncActionCreator = (personId: string) => {
    return async (dispatch) => {
        dispatch(subscriptionsSlice.actions.setIsSubmitting(true));
        await sendPostRequest(
            `api/patients/${personId}/unsubscribe`,
            resolveText("Patient_CouldNotUnsubscribe"),
            null,
            () => {
                dispatch(subscriptionsSlice.actions.removePatientSubscription(personId));
            },
            () => {},
            () => dispatch(subscriptionsSlice.actions.setIsSubmitting(false))
        );
    }
}