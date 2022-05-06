import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadObject } from "../../../sharedCommonComponents/helpers/LoadingHelpers";
import { sendPostRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { RemoteState } from "../../types/reduxInterfaces";
import { AsyncActionCreator } from "../../types/reduxTypes";

interface NotesState extends RemoteState {
    items: Models.PatientNote[];
}

const initialState: NotesState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}

export const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setNotes: (state, action: PayloadAction<Models.PatientNote[]>) => {
            state.items = action.payload;
        },
        addNote : (state, action: PayloadAction<Models.PatientNote>) => {
            state.items.push(action.payload);
        },
        markNoteAsSeen: (state, action: PayloadAction<string>) => {
            const matchingItem = state.items.find(x => x.id === action.payload);
            if(matchingItem) {
                matchingItem.hasBeenSeenBySharer = true;
            }
        },
        markNoteAsVerified: (state, action: PayloadAction<string>) => {
            const matchingItem = state.items.find(x => x.id === action.payload);
            if(matchingItem) {
                matchingItem.isVerified = true;
            }
        },
    }
});

export const loadNotes: AsyncActionCreator = (personId: string) => {
    return async (dispatch) => {
        dispatch(notesSlice.actions.setIsLoading(true));
        await loadObject<Models.PatientNote[]>(
            `api/persons/${personId}/patientnotes`, {},
            resolveText("Notes_CouldNotLoad"),
            notes => dispatch(notesSlice.actions.setNotes(notes)),
            () => dispatch(notesSlice.actions.setIsLoading(false))
        );
    }
}
export const addNote: AsyncActionCreator = (note: Models.PatientNote) => {
    return async (dispatch) => {
        dispatch(notesSlice.actions.setIsSubmitting(true));
        await sendPostRequest(
            `api/patientnotes`, 
            resolveText("Note_CouldNotStore"),
            note,
            () => dispatch(notesSlice.actions.addNote(note)),
            () => dispatch(notesSlice.actions.setIsSubmitting(false))
        );
    }
}
export const markNoteAsSeen: AsyncActionCreator = (noteId: string) => {
    return async (dispatch) => {
        await sendPostRequest(
            `api/patientnotes/${noteId}/seen`, 
            resolveText("HealthRecordEntry_CouldNotMarkAsSeen"),
            null,
            () => dispatch(notesSlice.actions.markNoteAsSeen(noteId)),
            () => {}
        );
    }
}
export const markNoteAsVerified: AsyncActionCreator = (noteId: string) => {
    return async (dispatch) => {
        await sendPostRequest(
            `api/patientnotes/${noteId}/verified`, 
            resolveText("HealthRecordEntry_CouldNotMarkAsVerified"),
            null,
            () => dispatch(notesSlice.actions.markNoteAsVerified(noteId)),
            () => {}
        );
    }
}
