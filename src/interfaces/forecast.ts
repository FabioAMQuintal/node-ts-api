import { BeachForecast } from "./beach";

export interface ForecastPointNormalized {
    time: string;
    waveDirection: number;
    waveHeight: number;
    swellDirection: number;
    swellHeight: number;
    swellPeriod: number;
    windDirection: number;
    windSpeed: number;
}

export interface TimeForecast {
    time: string,
    forecast: BeachForecast[]
}