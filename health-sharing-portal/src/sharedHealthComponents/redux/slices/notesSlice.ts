import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { RemoteState } from "../../types/reduxTypes";

interface NotesState extends RemoteState {
    items: Models.PatientNote[];
}

const initialState: NotesState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}

const notesSlice = createSlice({
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
            state.items.push(...action.payload);
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
    }
});

export const { setIsLoading, setIsSubmitting, setNotes, addNote, markNoteAsSeen } = notesSlice.actions;
export default notesSlice.reducer;