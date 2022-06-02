import { StormGlass } from "@src/clients/stormGlass";
import { Beach, BeachForecast } from "@src/interfaces/beach";
import { ForecastPointNormalized, TimeForecast } from "@src/interfaces/forecast";
import { ForecastProcessingInternalError } from './forecastProcessingErrors';

export class Forecast {
    constructor(protected stormGlass = new StormGlass()) {

    }

    public async processForecastForBeaches(beaches: Beach[]): Promise<TimeForecast[]> {
        const pointsWithCorrectSources: BeachForecast[] = []
        try {
            for (const beach of beaches) {
                const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
                const enrichedBeachData = this.enrichedBeachData(points, beach);
                pointsWithCorrectSources.push(...enrichedBeachData);
            }
            return this.mapForecastByTime(pointsWithCorrectSources);
        } catch (err: any) {
            throw new ForecastProcessingInternalError(err.message);
        }
    }

    private enrichedBeachData(points: ForecastPointNormalized[], beach: Beach): BeachForecast[] {
        return points.map((e) => ({
            ...{
                lat: beach.lat,
                lng: beach.lng,
                name: beach.name,
                position: beach.position,
                rating: 1
            },
            ...e
        }));
    };

    private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
        const forecastByTime: TimeForecast[] = [];
        for (const point of forecast) {
            const timePoint = forecastByTime.find((f) => f.time === point.time);
            if (timePoint) {
                timePoint.forecast.push(point);
            } else {
                forecastByTime.push({
                    time: point.time,
                    forecast: [point]
                })
            }
        }
        return forecastByTime
    }

}