import { RequestConfig, ResponseConfig } from "@src/interfaces/requestconfig";
import axios, { AxiosError } from "axios";

export class Request {
    constructor(private request = axios){

    }

    public get<T>(url: string, config: RequestConfig = {}): Promise<ResponseConfig<T>>{
        return this.request.get<T, ResponseConfig<T>>(url, config);
    }

    public static isRequestError(error: AxiosError): boolean {
        return !!(error.response && error.response.status);
    }

}