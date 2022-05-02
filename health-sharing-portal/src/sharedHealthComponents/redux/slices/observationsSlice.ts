import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { RemoteState } from "../../types/reduxTypes";

interface ObservationsState extends RemoteState {
    items: Models.Observations.Observation[];
}
const initialState: ObservationsState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}
const observationsSlice = createSlice({
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
            state.items.push(...action.payload);
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
    }
});

export const { setIsLoading, setIsSubmitting, setObservations, addObservation, markObservationAsSeen } = observationsSlice.actions;
export default observationsSlice.reducer;