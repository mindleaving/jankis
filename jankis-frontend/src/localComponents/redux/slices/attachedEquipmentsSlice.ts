import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { loadPersonDataActionBuilder } from "../../../sharedHealthComponents/redux/helpers/ActionCreatorBuilder";
import { RemoteState } from "../../../sharedHealthComponents/types/reduxInterfaces";
import { ViewModels } from "../../types/viewModels";

export interface AttachedEquipmentsState extends RemoteState<ViewModels.AttachedEquipmentViewModel> {
}
const initialState: AttachedEquipmentsState = {
    items: [],
    isLoading: false,
    isSubmitting: false
}

export const attachedEquipmentsSlice = createSlice({
    name: 'equipments',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsSubmitting: (state, action: PayloadAction<boolean>) => {
            state.isSubmitting = action.payload;
        },
        setAttachedEquipments: (state, action: PayloadAction<ViewModels.AttachedEquipmentViewModel[]>) => {
            state.items = action.payload;
        }
    }
});

export const loadAttachedEquipments = loadPersonDataActionBuilder(
    personId => `api/persons/${personId}/equipments`,
    () => resolveText("Equipments_CouldNotLoad"),
    attachedEquipmentsSlice.actions.setIsLoading,
    attachedEquipmentsSlice.actions.setAttachedEquipments
);