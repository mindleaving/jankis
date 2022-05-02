import { Action, ActionCreator, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadObject } from "../../../sharedCommonComponents/helpers/LoadingHelpers";
import { RemoteState } from "../../types/reduxTypes";
import { RootState } from "../store/healthRecordStore";

interface PersonsState extends RemoteState {
    items: Models.Person[];
}

const initialState: PersonsState = {
    items: [],
    isLoading: false,
    isSubmitting: false
};

const personsSlice = createSlice({
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

type AsyncActionCreator = ActionCreator<ThunkAction<Promise<void>, RootState, void, Action>>;
export const createLoadPersonAction: AsyncActionCreator = (personId: string) => {
    return async (dispatch) => {
        dispatch(setIsLoading(true));
        await loadObject<Models.Person>(
            `api/persons/${personId}`, {},
            resolveText("Person_CouldNotLoad"),
            person => dispatch(addPerson(person)),
            () => dispatch(setIsLoading(false))
        );
    }
}

export const { setIsLoading, setIsSubmitting, addPerson } = personsSlice.actions;
export default personsSlice.reducer;