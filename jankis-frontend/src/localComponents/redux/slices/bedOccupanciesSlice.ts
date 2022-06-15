import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { distinct } from "../../../sharedCommonComponents/helpers/CollectionHelpers";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadActionBuilder, loadPersonDataActionBuilder, postActionBuilder } from "../../../sharedHealthComponents/redux/helpers/ActionCreatorBuilder";
import { RemoteState } from "../../../sharedHealthComponents/types/reduxInterfaces";
import { Models } from "../../types/models";

export interface BedOccupanciesState extends RemoteState<Models.BedOccupancy> {
}

const initialState: BedOccupanciesState = {
    items: [],
    isLoading: false,
    isSubmitting: false
};

export const bedOccupanciesSlice = createSlice({
    name: 'bedOccupancies',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setBedOccupancies: (state, action: PayloadAction<Models.BedOccupancy[]>) => {
            state.items = action.payload;
        },
        addBedOccupancies: (state, action: PayloadAction<Models.BedOccupancy[]>) => {
            state.items = distinct(state.items.concat(action.payload));
        },
        addOrUpdateBedOccupancy: (state, action: PayloadAction<Models.BedOccupancy>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        }
    }
});

export const loadBedOccupanciesForPerson = loadPersonDataActionBuilder(
    personId => `api/persons/${personId}/bedOccupancies`,
    () => resolveText("BedOccupancies_CouldNotLoad"),
    bedOccupanciesSlice.actions.setIsLoading,
    bedOccupanciesSlice.actions.setBedOccupancies
);
export const loadBedOccupanciesForInstitution = loadActionBuilder(
    args => `api/institutions/${args}/bedoccupancies`,
    () => resolveText("BedOccupancies_CouldNotLoad"),
    bedOccupanciesSlice.actions.setIsLoading,
    bedOccupanciesSlice.actions.addBedOccupancies
);
export const addOrUpdateBedOccupancy = postActionBuilder(
    () => `api/bedoccupancies`, 
    () => resolveText("BedOccupancy_CouldNotStore"),
    bedOccupanciesSlice.actions.setIsSubmitting,
    bedOccupanciesSlice.actions.addOrUpdateBedOccupancy
);