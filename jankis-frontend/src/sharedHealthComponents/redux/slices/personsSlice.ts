import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { RemoteState } from "../../types/reduxInterfaces";
import { loadPersonDataActionBuilder, postActionBuilder } from "../helpers/ActionCreatorBuilder";

interface PersonsState extends RemoteState<Models.Person> {
}

const initialState: PersonsState = {
    items: [],
    isLoading: false,
    isSubmitting: false
};

export const personsSlice = createSlice({
    name: 'persons',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        addOrUpdatePerson: (state, action: PayloadAction<Models.Person>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        }
    }
});

export const loadPerson = loadPersonDataActionBuilder(
    personId => `api/persons/${personId}`,
    () => resolveText("Person_CouldNotLoad"),
    personsSlice.actions.setIsLoading,
    personsSlice.actions.addOrUpdatePerson
);
export const addPerson = postActionBuilder(
    () => `api/persons`,
    () => resolveText("Person_CouldNotStore"),
    personsSlice.actions.setIsSubmitting,
    personsSlice.actions.addOrUpdatePerson
);
