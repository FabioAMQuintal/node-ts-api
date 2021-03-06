import { ForecastPointNormalized } from "./forecast";

export enum BeachPosition {
    S = 'S',
    E = 'E',
    W = 'W',
    N = 'N',
}

export interface Beach {
    name: string;
    position: BeachPosition;
    lat: number;
    lng: number;
    user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPointNormalized {

}