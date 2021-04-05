import { buildUrl } from '../helpers/UrlBuilder';
import { ApiError } from './ApiError';

export class ApiClient {
    serverAddress: string;
    port: number;
    accessToken: string | undefined;

    constructor(serverAddress: string, port: number) {
        this.serverAddress = serverAddress;
        this.port = port;
        this.accessToken = undefined;
    }

    get = async (path: string, params: { [key: string]: string }, handleError: boolean = true) => {
        return await this._sendRequest("GET", path, params, undefined, handleError);
    }

    put = async (path: string, params: { [key: string]: string }, body: any, handleError: boolean = true) => {
        return await this._sendRequest("PUT", path, params, body, handleError);
    }

    post = async (path: string, params: { [key: string]: string }, body: any, handleError: boolean = true) => {
        return await this._sendRequest("POST", path, params, body, handleError);
    }

    patch = async (path: string, params: { [key: string]: string }, body: any, handleError: boolean = true) => {
        return await this._sendRequest("PATCH", path, params, body, handleError);
    }

    delete = async (path: string, params: { [key: string]: string }, handleError: boolean = true) => {
        return await this._sendRequest("DELETE", path, params, undefined, handleError);
    }

    setAccessToken = (accessToken: string) => {
        this.accessToken = accessToken;
    }

    _sendRequest = async (
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
        path: string, 
        params: { [key: string]: string },
        body?: any,
        handleError: boolean = true) => {

        const requestUrl = buildUrl(`https://${this.serverAddress}:${this.port}`, path, params);
        const jsonBody = body ? this._convertToJson(body) : undefined;
        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        };
        if(this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }
        const response = await fetch(requestUrl, {
            method: method,
            body: jsonBody,
            headers: headers
        });
        if(handleError && !response.ok) {
            return await this._handleError(response);
        }
        return response;
    }

    _convertToJson = (body: any) => {
        if(typeof body === "string") {
            return body;
        }
        if(typeof body === "object") {
            return JSON.stringify(body);
        }
        throw new Error(`Body to be sent to server must be either of type 'object' or a JSON-string, but was ${typeof body}`);
    }

    _handleError = async (response: Response) => {
        throw new ApiError(response.status, await response.text());
    }
}

export const apiClient = window.location.hostname.toLowerCase() === "localhost"
    ? new ApiClient(window.location.hostname, 44318)
    : new ApiClient(window.location.hostname, 80);