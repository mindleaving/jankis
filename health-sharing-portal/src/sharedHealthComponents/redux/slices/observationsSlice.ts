import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadObject } from "../../../sharedCommonComponents/helpers/LoadingHelpers";
import { sendPostRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { RemoteState } from "../../types/reduxInterfaces";
import { AsyncActionCreator } from "../../types/reduxTypes";

interface ObservationsState extends RemoteState {
    items: Models.Observations.Observation[];
}
const initialState: ObservationsState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}
export const observationsSlice = createSlice({
    name: 'observations',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setObservations: (state, action: PayloadAction<Models.Observations.Observation[]>) => {
            state.items = action.payload;
        },
        addObservation : (state, action: PayloadAction<Models.Observations.Observation>) => {
            state.items.push(action.payload);
        },
        markObservationAsSeen: (state, action: PayloadAction<string>) => {
            const matchingItem = state.items.find(x => x.id === action.payload);
            if(matchingItem) {
                matchingItem.hasBeenSeenBySharer = true;
            }
        },
        markObservationAsVerified: (state, action: PayloadAction<string>) => {
            const matchingItem = state.items.find(x => x.id === action.payload);
            if(matchingItem) {
                matchingItem.isVerified = true;
            }
        },
    }
});

export const loadObservations: AsyncActionCreator = (personId: string) => {
    return async (dispatch) => {
        dispatch(observationsSlice.actions.setIsLoading(true));
        await loadObject<Models.Observations.Observation[]>(
            `api/persons/${personId}/observations`, {},
            resolveText("Observations_CouldNotLoad"),
            observations => dispatch(observationsSlice.actions.setObservations(observations)),
            () => dispatch(observationsSlice.actions.setIsLoading(false))
        );
    }
}
export const addObservation: AsyncActionCreator = (observation: Models.Observations.Observation) => {
    return async (dispatch) => {
        dispatch(observationsSlice.actions.setIsSubmitting(true));
        await sendPostRequest(
            `api/observations`, 
            resolveText("Observation_CouldNotStore"),
            observation,
            () => dispatch(observationsSlice.actions.addObservation(observation)),
            () => dispatch(observationsSlice.actions.setIsSubmitting(false))
        );
    }
}
export const markObservationAsSeen: AsyncActionCreator = (observationId: string) => {
    return async (dispatch) => {
        await sendPostRequest(
            `api/observations/${observationId}/seen`, 
            resolveText("HealthRecordEntry_CouldNotMarkAsSeen"),
            null,
            () => dispatch(observationsSlice.actions.markObservationAsSeen(observationId)),
            () => {}
        );
    }
}
export const markObservationAsVerified: AsyncActionCreator = (observationId: string) => {
    return async (dispatch) => {
        await sendPostRequest(
            `api/observations/${observationId}/verified`, 
            resolveText("HealthRecordEntry_CouldNotMarkAsVerified"),
            null,
            () => dispatch(observationsSlice.actions.markObservationAsVerified(observationId)),
            () => {}
        );
    }
}
