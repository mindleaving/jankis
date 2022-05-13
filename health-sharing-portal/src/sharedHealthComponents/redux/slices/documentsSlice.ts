import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { RemoteState } from "../../types/reduxInterfaces";
import { deleteActionBuilder, loadActionBuilder, loadPersonDataActionBuilder, postActionBuilder } from "../helpers/ActionCreatorBuilder";

interface DocumentsState extends RemoteState<Models.PatientDocument> {
}
const initialState: DocumentsState = {
    items: [],
    isLoading: false,
    isSubmitting: false
};

export const documentsSlice = createSlice({
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
            state.items = action.payload;
        },
        addOrUpdateDocument: (state, action: PayloadAction<Models.PatientDocument>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        },
        removeDocument: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(x => x.id !== action.payload);
        },
        markDocumentAsSeen: (state, action: PayloadAction<string>) => {
            const matchingItem = state.items.find(x => x.id === action.payload);
            if(matchingItem) {
                matchingItem.hasBeenSeenBySharer = true;
            }
        },
        markDocumentAsVerified: (state, action: PayloadAction<string>) => {
            const matchingItem = state.items.find(x => x.id === action.payload);
            if(matchingItem) {
                matchingItem.isVerified = true;
            }
        }
    }
});

export const loadDocuments = loadPersonDataActionBuilder(
    personId => `api/persons/${personId}/documents`,
    () => resolveText("Documents_CouldNotLoad"),
    documentsSlice.actions.setIsLoading,
    documentsSlice.actions.setDocuments
);
export const loadDocument = loadActionBuilder(
    args => `api/documents/${args}`,
    () => resolveText("Document_CouldNotLoad"),
    documentsSlice.actions.setIsLoading,
    documentsSlice.actions.addOrUpdateDocument
);
export const addDocument = postActionBuilder(
    () => `api/documents`, 
    () => resolveText("Document_CouldNotStore"),
    documentsSlice.actions.setIsSubmitting,
    documentsSlice.actions.addOrUpdateDocument
);
export const deleteDocument = deleteActionBuilder(
    args => `api/documents/${args}`,
    () => resolveText("Document_SuccessfullyDeleted"),
    () => resolveText("Document_CouldNotDelete"),
    documentsSlice.actions.removeDocument
);
export const markDocumentAsSeen = postActionBuilder(
    documentId => `api/documents/${documentId}/seen`, 
    () => resolveText("HealthRecordEntry_CouldNotMarkAsSeen"),
    documentsSlice.actions.setIsSubmitting,
    documentsSlice.actions.markDocumentAsSeen
);
export const markDocumentAsVerified = postActionBuilder(
    documentId => `api/documents/${documentId}/verified`, 
    () => resolveText("HealthRecordEntry_CouldNotMarkAsVerified"),
    documentsSlice.actions.setIsSubmitting,
    documentsSlice.actions.markDocumentAsVerified
);