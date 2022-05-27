import { StormGlass } from "@src/clients/stormGlass";
import { Beach, BeachForecast } from "@src/interfaces/beach";
import { TimeForecast } from "@src/interfaces/forecast";

export class Forecast {
    constructor(protected stormGlass = new StormGlass()){

    }

    public async processForecastForBeaches(beaches: Beach[]): Promise<TimeForecast[]>{
        const pointsWithCorrectSources: BeachForecast[] = []
        for(const beach of beaches){
            const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
            const enrichedBeachData = points.map((e) => ({
                ...{
                    lat: beach.lat,
                    lng: beach.lng,
                    name: beach.name,
                    position: beach.position,
                    rating: 1
                },
                ...e
            }));
            pointsWithCorrectSources.push(...enrichedBeachData);
        }
        return this.mapForecastByTime(pointsWithCorrectSources);
    }

    private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
        const forecastByTime: TimeForecast[] = [];
        for(const point of forecast){
            const timePoint = forecastByTime.find((f) => f.time === point.time);
            if(timePoint){
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