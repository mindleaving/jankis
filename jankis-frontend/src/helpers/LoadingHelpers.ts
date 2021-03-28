import { apiClient } from "../communication/ApiClient";
import { NoficationManager } from 'react-notifications';

export const buildLoadObjectFunc = <T extends unknown>(
    apiPath: string,
    errorText: string,
    onItemLoaded: (item: T) => void,
    onFinally?: () => void) => {
    return async () => await loadObject(apiPath, errorText, onItemLoaded, onFinally);
}
export const loadObject = async <T extends unknown>(
    apiPath: string,
    errorText: string,
    onItemLoaded: (item: T) => void,
    onFinally?: () => void
) => {
    try {
        const response = await apiClient.get(apiPath, {});
        const item = await response.json() as T;
        onItemLoaded(item);

    } catch (error) {
        NoficationManager.error(error.message, errorText);
    } finally {
        if(onFinally) {
            onFinally();
        }
    }
}