import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Models } from "../../../localComponents/types/models";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadObject } from "../../../sharedCommonComponents/helpers/LoadingHelpers";
import { sendPostRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { RemoteState } from "../../types/reduxInterfaces";
import { AsyncActionCreator } from "../../types/reduxTypes";

interface DocumentsState extends RemoteState {
    items: Models.PatientDocument[];
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
        addDocument: (state, action: PayloadAction<Models.PatientDocument>) => {
            state.items.push(action.payload);
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

export const loadDocuments: AsyncActionCreator = (personId: string) => {
    return async (dispatch) => {
        dispatch(documentsSlice.actions.setIsLoading(true));
        await loadObject<Models.PatientDocument[]>(
            `api/persons/${personId}/documents`, {},
            resolveText("Documents_CouldNotLoad"),
            documents => dispatch(documentsSlice.actions.setDocuments(documents)),
            () => dispatch(documentsSlice.actions.setIsLoading(false))
        );
    }
}
export const addDocument: AsyncActionCreator = (document: Models.PatientDocument) => {
    return async (dispatch) => {
        dispatch(documentsSlice.actions.setIsSubmitting(true));
        await sendPostRequest(
            `api/documents`, 
            resolveText("Document_CouldNotStore"),
            document,
            () => dispatch(documentsSlice.actions.addDocument(document)),
            () => dispatch(documentsSlice.actions.setIsSubmitting(false))
        );
    }
}
export const markDocumentAsSeen: AsyncActionCreator = (documentId: string) => {
    return async (dispatch) => {
        await sendPostRequest(
            `api/documents/${documentId}/seen`, 
            resolveText("HealthRecordEntry_CouldNotMarkAsSeen"),
            null,
            () => dispatch(documentsSlice.actions.markDocumentAsSeen(documentId)),
            () => {}
        );
    }
}
export const markDocumentAsVerified: AsyncActionCreator = (documentId: string) => {
    return async (dispatch) => {
        await sendPostRequest(
            `api/documents/${documentId}/verified`, 
            resolveText("HealthRecordEntry_CouldNotMarkAsVerified"),
            null,
            () => dispatch(documentsSlice.actions.markDocumentAsVerified(documentId)),
            () => {}
        );
    }
}
