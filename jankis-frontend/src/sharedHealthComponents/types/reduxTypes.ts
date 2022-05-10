import { Action, ActionCreator, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../../localComponents/redux/store/healthRecordStore";
import { 
    ApiDeleteActionCreatorArguments, 
    ApiGetActionCreatorArguments, 
    ApiGetPersonDataActionCreatorArguments, 
    ApiPostActionCreatorArguments, 
    TypedActionCreator 
} from "./reduxInterfaces";

export type AsyncActionCreator = ActionCreator<ThunkAction<Promise<void>, RootState, void, Action>>;
export type ApiGetActionCreator<ArgsType,ItemType> = TypedActionCreator<ThunkAction<Promise<void>, RootState, void, Action>, ApiGetActionCreatorArguments<ArgsType,ItemType>>;
export type ApiGetPersonDataActionCreator<T> = TypedActionCreator<ThunkAction<Promise<void>, RootState, void, Action>, ApiGetPersonDataActionCreatorArguments<T>>;
export type ApiPostActionCreator<ArgsType,BodyType> = TypedActionCreator<ThunkAction<Promise<void>, RootState, void, Action>, ApiPostActionCreatorArguments<ArgsType,BodyType>>;
export type ApiDeleteActionCreator<ArgsType> = TypedActionCreator<ThunkAction<Promise<void>, RootState, void, Action>, ApiDeleteActionCreatorArguments<ArgsType>>;