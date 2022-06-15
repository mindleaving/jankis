import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RemoteState } from "../../../sharedHealthComponents/types/reduxInterfaces";
import { Models } from "../../types/models";

export interface RoomsState extends RemoteState<Models.Room> {
}

const initialState: RoomsState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}

export const roomsSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setRooms: (state, action: PayloadAction<Models.Room[]>) => {
            state.items = action.payload;
        },
        addOrUpdateRoom: (state, action: PayloadAction<Models.Room>) => {
            const item = action.payload;
            if(state.items.some(x => x.id === item.id)) {
                state.items = state.items.map(x => x.id === item.id ? item : x);
            } else {
                state.items.push(item);
            }
        }
    }
});