export interface RemoteState<T> {
    items: T[];
    isLoading: boolean;
    isSubmitting: boolean;
}
export interface TypedActionCreator<ActionType,ArgumentType> {
    (args: ArgumentType): ActionType;
}
export interface ApiGetActionCreatorArguments<T> {
    onSuccess?: (item: T) => void;
    onFailure?: () => void;
}
export interface ApiGetPersonDataActionCreatorArguments<T> extends ApiGetActionCreatorArguments<T> {
    personId: string;
}
export interface ApiPostActionCreatorArguments<ArgsType, BodyType> {
    args: ArgsType,
    body?: BodyType,
    onSuccess?: (response: Response) => void;
    onFailure?: () => void;
}
export interface ApiDeleteActionCreatorArguments<ArgsType> {
    args: ArgsType,
    onSuccess?: () => void;
    onFailure?: () => void;
}