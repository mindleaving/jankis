export interface RemoteState<T> {
    items: T[];
    isLoading: boolean;
    isSubmitting: boolean;
}
export interface TypedActionCreator<ActionType,ArgumentType> {
    (args: ArgumentType): ActionType;
}
export interface ApiGetActionCreatorArguments<ArgsType,ItemType> {
    args?: ArgsType;
    onSuccess?: (item: ItemType) => void;
    onFailure?: () => void;
}
export interface ApiGetPersonDataActionCreatorArguments<T> extends ApiGetActionCreatorArguments<string,T> {
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