import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadActionBuilder, postActionBuilder } from "../../../sharedHealthComponents/redux/helpers/ActionCreatorBuilder";
import { RemoteState } from "../../../sharedHealthComponents/types/reduxInterfaces";
import { Models } from "../../types/models";

export interface AccountsState extends RemoteState<Models.Account> {
}

const initialState: AccountsState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}

export const accountsSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setAccounts: (state, action: PayloadAction<Models.Account[]>) => {
            state.items = action.payload;
        },
        addOrUpdateAccount: (state, action: PayloadAction<Models.Account>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        }
    }
});

export const loadAccounts = loadActionBuilder(
    () => `api/accounts`,
    () => resolveText("Accounts_CouldNotLoad"),
    accountsSlice.actions.setIsLoading,
    accountsSlice.actions.setAccounts
);
export const addOrUpdateAccount = postActionBuilder(
    () => `api/accounts`, 
    () => resolveText("Account_CouldNotStore"),
    accountsSlice.actions.setIsSubmitting,
    accountsSlice.actions.addOrUpdateAccount
);