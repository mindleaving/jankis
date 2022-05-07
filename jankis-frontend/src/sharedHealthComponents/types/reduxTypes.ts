import { Action, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../../localComponents/redux/store/healthRecordStore";
import { ApiDeleteActionCreatorArguments, ApiGetActionCreatorArguments, ApiGetPersonDataActionCreatorArguments, ApiPostActionCreatorArguments, TypedActionCreator } from "./reduxInterfaces";

export type ApiGetActionCreator<T> = TypedActionCreator<ThunkAction<Promise<void>, RootState, void, Action>, ApiGetActionCreatorArguments<T>>;
export type ApiGetPersonDataActionCreator<T> = TypedActionCreator<ThunkAction<Promise<void>, RootState, void, Action>, ApiGetPersonDataActionCreatorArguments<T>>;
export type ApiPostActionCreator<ArgsType,BodyType> = TypedActionCreator<ThunkAction<Promise<void>, RootState, void, Action>, ApiPostActionCreatorArguments<ArgsType,BodyType>>;
export type ApiDeleteActionCreator<ArgsType> = TypedActionCreator<ThunkAction<Promise<void>, RootState, void, Action>, ApiDeleteActionCreatorArguments<ArgsType>>;