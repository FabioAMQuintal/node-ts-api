export interface StormGlassSource {
    [key: string]: number;
}

export interface StormGlassPoint {
    time: string;
    readonly waveDirection: StormGlassSource;
    readonly waveHeight: StormGlassSource;
    readonly swellDirection: StormGlassSource;
    readonly swellHeight: StormGlassSource;
    readonly swellPeriod: StormGlassSource;
    readonly windDirection: StormGlassSource;
    readonly windSpeed: StormGlassSource;
}

export interface StormGlassForecastResponse {
    hours: StormGlassPoint[];
}



