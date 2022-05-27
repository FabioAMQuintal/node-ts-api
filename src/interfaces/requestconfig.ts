import { AxiosRequestConfig, AxiosResponse } from "axios";

export interface RequestConfig extends AxiosRequestConfig {

}

export interface ResponseConfig<T = any> extends AxiosResponse<T> {

}