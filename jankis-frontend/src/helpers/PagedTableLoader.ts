import { apiClient } from "../communication/ApiClient";
import { OrderDirection } from "../types/frontendTypes.d";
import { NotificationManager } from 'react-notifications';

export default class PagedTableLoader<T> {
    apiPath: string;
    errorMessage: string;
    callback: (items: T[]) => void;

    constructor(
        apiPath: string,
        errorMessage: string,
        callback: (items: T[]) => void) {
        this.apiPath = apiPath;
        this.errorMessage = errorMessage;
        this.callback = callback;
    }

    load = async (pageIndex: number, entriesPerPage: number, orderBy?: string, orderDirection?: OrderDirection) => {
        try {
            let params: { [ key: string]: string } = {
                "count": entriesPerPage + '',
                "skip": (pageIndex * entriesPerPage) + ''
            }
            if(orderBy) {
                params["orderBy"] = orderBy;
                params["orderDirection"] = orderDirection ?? OrderDirection.Ascending;
            }
            const response = await apiClient.get(this.apiPath, params);
            const items = await response.json() as T[];
            this.callback(items);
        } catch(error) {
            NotificationManager.error(error.message, this.errorMessage);
        }
    }
}