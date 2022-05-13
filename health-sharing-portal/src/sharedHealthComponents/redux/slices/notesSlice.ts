import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { RemoteState } from "../../types/reduxInterfaces";
import { deleteActionBuilder, loadActionBuilder, loadPersonDataActionBuilder, postActionBuilder } from "../helpers/ActionCreatorBuilder";

interface NotesState extends RemoteState<Models.PatientNote> {
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
        addOrUpdateNote: (state, action: PayloadAction<Models.PatientNote>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        },
        removeNote: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(x => x.id !== action.payload);
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

export const loadNotes = loadPersonDataActionBuilder(
    personId => `api/persons/${personId}/notes`,
    () => resolveText("Notes_CouldNotLoad"),
    notesSlice.actions.setIsLoading,
    notesSlice.actions.setNotes
);
export const loadNote = loadActionBuilder(
    args => `api/notes/${args}`,
    () => resolveText("Note_CouldNotLoad"),
    notesSlice.actions.setIsLoading,
    notesSlice.actions.addOrUpdateNote
);
export const addNote = postActionBuilder(
    () => `api/notes`, 
    () => resolveText("Note_CouldNotStore"),
    notesSlice.actions.setIsSubmitting,
    notesSlice.actions.addOrUpdateNote
);
export const deleteNote = deleteActionBuilder(
    args => `api/notes/${args}`,
    () => resolveText("Note_SuccessfullyDeleted"),
    () => resolveText("Note_CouldNotDelete"),
    notesSlice.actions.removeNote
);
export const markNoteAsSeen = postActionBuilder(
    noteId => `api/notes/${noteId}/seen`, 
    () => resolveText("HealthRecordEntry_CouldNotMarkAsSeen"),
    notesSlice.actions.setIsSubmitting,
    notesSlice.actions.markNoteAsSeen
);
export const markNoteAsVerified = postActionBuilder(
    noteId => `api/notes/${noteId}/verified`, 
    () => resolveText("HealthRecordEntry_CouldNotMarkAsVerified"),
    notesSlice.actions.setIsSubmitting,
    notesSlice.actions.markNoteAsVerified
);
