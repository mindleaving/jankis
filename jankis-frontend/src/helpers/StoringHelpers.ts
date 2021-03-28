import { apiClient } from "../communication/ApiClient";
import { NotificationManager } from 'react-notifications';

export const buidlAndStoreObject = async <T extends unknown>(
    apiPath: string,
    errorText: string,
    itemBuilder: () => T,
    onFinally?: () => void
) => {
    try {
        const item = itemBuilder();
        await apiClient.put(apiPath, {}, item);
    } catch(error) {
        NotificationManager.error(error.message, errorText);
    } finally {
        if(onFinally) {
            onFinally();
        }
    }
}

export const storeObject = async <T extends unknown>(
    apiPath: string,
    errorText: string,
    item: T,
    onFinally?: () => void
) => {
    try {
        await apiClient.put(apiPath, {}, item);
    } catch(error) {
        NotificationManager.error(error.message, errorText);
    } finally {
        if(onFinally) {
            onFinally();
        }
    }
}