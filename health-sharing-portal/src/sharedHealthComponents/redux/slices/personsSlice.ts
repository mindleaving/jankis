import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadObject } from "../../../sharedCommonComponents/helpers/LoadingHelpers";
import { sendPutRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { RemoteState } from "../../types/reduxInterfaces";
import { AsyncActionCreator } from "../../types/reduxTypes";

interface PersonsState extends RemoteState {
    items: Models.Person[];
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
        addPerson: (state, action: PayloadAction<Models.Person>) => {
            state.items.push(action.payload)
        }
    }
});

export const loadPerson: AsyncActionCreator = (personId: string) => {
    return async (dispatch) => {
        dispatch(personsSlice.actions.setIsLoading(true));
        await loadObject<Models.Person>(
            `api/persons/${personId}`, {},
            resolveText("Person_CouldNotLoad"),
            person => dispatch(personsSlice.actions.addPerson(person)),
            () => dispatch(personsSlice.actions.setIsLoading(false))
        );
    }
}
export const addPerson: AsyncActionCreator = (person: Models.Person) => {
    return async (dispatch) => {
        dispatch(personsSlice.actions.setIsSubmitting(true));
        await sendPutRequest(
            `api/persons/${person.id}`,
            resolveText("Person_CouldNotStore"),
            () => dispatch(personsSlice.actions.addPerson(person)),
            () => dispatch(personsSlice.actions.setIsSubmitting(false))
        );
    }
}
