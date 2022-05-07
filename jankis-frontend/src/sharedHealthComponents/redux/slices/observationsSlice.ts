import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { RemoteState } from "../../types/reduxInterfaces";
import { loadPersonDataActionBuilder, postActionBuilder } from "../helpers/ActionCreatorBuilder";

interface ObservationsState extends RemoteState<Models.Observations.Observation> {
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
        addOrUpdateObservation: (state, action: PayloadAction<Models.Observations.Observation>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
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

export const loadObservations = loadPersonDataActionBuilder(
    personId => `api/persons/${personId}/observations`,
    () => resolveText("Observations_CouldNotLoad"),
    observationsSlice.actions.setIsLoading,
    observationsSlice.actions.setObservations
);
export const addObservation = postActionBuilder(
    () => `api/observations`, 
    () => resolveText("Observation_CouldNotStore"),
    observationsSlice.actions.setIsSubmitting,
    observationsSlice.actions.addOrUpdateObservation
);
export const markObservationAsSeen = postActionBuilder(
    observationId => `api/observations/${observationId}/seen`,
    () => resolveText("HealthRecordEntry_CouldNotMarkAsSeen"),
    observationsSlice.actions.setIsSubmitting,
    observationsSlice.actions.markObservationAsSeen
);
export const markObservationAsVerified = postActionBuilder(
    observationId => `api/observations/${observationId}/verified`,
    () => resolveText("HealthRecordEntry_CouldNotMarkAsVerified"),
    observationsSlice.actions.setIsSubmitting,
    observationsSlice.actions.markObservationAsVerified
);
