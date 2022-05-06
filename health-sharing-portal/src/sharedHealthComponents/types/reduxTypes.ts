import { Action, ActionCreator, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../redux/store/healthRecordStore";

export type AsyncActionCreator = ActionCreator<ThunkAction<Promise<void>, RootState, void, Action>>