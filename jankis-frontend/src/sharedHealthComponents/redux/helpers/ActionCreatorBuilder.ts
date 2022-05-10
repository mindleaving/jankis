import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { deleteObject } from "../../../sharedCommonComponents/helpers/DeleteHelpers";
import { loadObject } from "../../../sharedCommonComponents/helpers/LoadingHelpers";
import { sendPostRequest } from "../../../sharedCommonComponents/helpers/StoringHelpers";
import { ApiDeleteActionCreator, ApiGetActionCreator, ApiGetPersonDataActionCreator, ApiPostActionCreator } from "../../types/reduxTypes";


export const postActionBuilder = <ArgsType extends unknown, BodyType extends unknown>(
    apiPathBuilder: (args: ArgsType) => string,
    errorTextBuilder: () => string,
    setIsSubmitting: ActionCreatorWithPayload<boolean>,
    storeCallback: ActionCreatorWithPayload<ArgsType>): ApiPostActionCreator<ArgsType,BodyType> => {
    return ({ args, body, onSuccess, onFailure }) => {
        return async (dispatch) => {
            dispatch(setIsSubmitting(true));
            await sendPostRequest(
                apiPathBuilder(args),
                errorTextBuilder(),
                body,
                response => {
                    dispatch(storeCallback(args));
                    if(onSuccess) {
                        onSuccess(response);
                    }
                },
                () => {
                    if(onFailure) {
                        onFailure();
                    }
                },
                () => dispatch(setIsSubmitting(false))
            );
        }
    }
}
export const loadPersonDataActionBuilder = <T extends unknown>(
    apiPathBuilder: (personId: string) => string,
    errorTextBuilder: () => string,
    setIsLoading: ActionCreatorWithPayload<boolean>,
    setItem: ActionCreatorWithPayload<T>): ApiGetPersonDataActionCreator<T> => {
    return ({ personId, onSuccess, onFailure }) => {
        return async (dispatch) => {
            dispatch(setIsLoading(true));
            await loadObject<T>(
                apiPathBuilder(personId), {},
                errorTextBuilder(),
                item => {
                    dispatch(setItem(item));
                    if(onSuccess) {
                        onSuccess(item);
                    }
                },
                onFailure,
                () => dispatch(setIsLoading(false))
            );
        }
    }
}
export const loadActionBuilder = <ArgsType extends unknown,ItemType extends unknown>(
    apiPathBuilder: (args: any) => string,
    errorTextBuilder: () => string,
    setIsLoading: ActionCreatorWithPayload<boolean>,
    setItem: ActionCreatorWithPayload<ItemType>): ApiGetActionCreator<ArgsType,ItemType> => {
    return ({ args, onSuccess, onFailure }) => {
        return async (dispatch) => {
            dispatch(setIsLoading(true));
            await loadObject<ItemType>(
                apiPathBuilder(args), {},
                errorTextBuilder(),
                item => {
                    dispatch(setItem(item));
                    if(onSuccess) {
                        onSuccess(item);
                    }
                },
                onFailure,
                () => dispatch(setIsLoading(false))
            );
        }
    }
}
export const deleteActionBuilder = <ArgsType extends unknown>(
    apiPathBuilder: (args: ArgsType) => string,
    successTextBuilder: () => string,
    errorTextBuilder: () => string,
    storeCallback: ActionCreatorWithPayload<ArgsType>): ApiDeleteActionCreator<ArgsType> => {
    return ({ args, onSuccess, onFailure }) => {
        return async (dispatch) => {
            await deleteObject(
                apiPathBuilder(args), {},
                successTextBuilder(),
                errorTextBuilder(),
                () => {
                    dispatch(storeCallback(args));
                    if(onSuccess) {
                        onSuccess();
                    }
                },
                () => {
                    if(onFailure) {
                        onFailure();
                    }
                }
            );
        }
    }
}