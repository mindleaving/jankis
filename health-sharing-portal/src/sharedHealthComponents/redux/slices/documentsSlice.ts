import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { RemoteState } from "../../types/reduxTypes";

interface DocumentsState extends RemoteState {
    items: Models.PatientDocument[];
}
const initialState: DocumentsState = {
    items: [],
    isLoading: false,
    isSubmitting: false
};

const documentsSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setDocuments: (state, action: PayloadAction<Models.PatientDocument[]>) => {
            state.items.push(...action.payload);
        },
        addDocument: (state, action: PayloadAction<Models.PatientDocument>) => {
            state.items.push(action.payload);
        },
        markDocumentAsSeen: (state, action: PayloadAction<string>) => {
            const matchingItem = state.items.find(x => x.id === action.payload);
            if(matchingItem) {
                matchingItem.hasBeenSeenBySharer = true;
            }
        }
    }
});

export const { setIsLoading, setIsSubmitting, setDocuments, addDocument, markDocumentAsSeen } = documentsSlice.actions;
export default documentsSlice.reducer;