import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { departmentsSlice } from "./slices/departmentsSlice";
import { stocksSlice } from "./slices/stocksSlice";

export const store = configureStore({
    reducer: {
        departments: departmentsSlice.reducer,
        stocks: stocksSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();