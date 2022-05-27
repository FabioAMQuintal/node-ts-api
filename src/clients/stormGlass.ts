import { StormGlassForecastResponse, StormGlassPoint } from "@src/interfaces/stormglassforecast";
import { ForecastPointNormalized } from "@src/interfaces/forecast";
import { AxiosStatic } from "axios";
import { ClientRequestError } from "@src/util/errors/client-request-error";
import { StormGlassResponseError } from "@src/util/errors/stormglass-response-error";

export class StormGlass {

    readonly stormGlassAPIParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
    readonly stormGlassAPISource = 'noaa';

    constructor(protected req: AxiosStatic) {

    }

    public async fetchPoints(lat: number, lng: number): Promise<ForecastPointNormalized[]> {
        try {
            const response = await this.req.get<StormGlassForecastResponse>(
                `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`,
                {
                    headers: {
                        Authorization: 'fake-token'
                    }
                }
            );
            return this.normalizeResponse(response.data);
        } catch (err: any) {
            if(err.response && err.response.status){
                throw new StormGlassResponseError(`Error: ${JSON.stringify(err.response.data)} Code: ${err.response.status}`)
            }
            throw new ClientRequestError(err.message);
        }
    }

    private normalizeResponse(points: StormGlassForecastResponse): ForecastPointNormalized[] {
        return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
            swellDirection: point.swellDirection[this.stormGlassAPISource],
            swellHeight: point.swellHeight[this.stormGlassAPISource],
            swellPeriod: point.swellPeriod[this.stormGlassAPISource],
            time: point.time,
            waveDirection: point.waveDirection[this.stormGlassAPISource],
            waveHeight: point.waveHeight[this.stormGlassAPISource],
            windDirection: point.windDirection[this.stormGlassAPISource],
            windSpeed: point.windSpeed[this.stormGlassAPISource],
        }));
    }

    private isValidPoint(point: Partial<StormGlassPoint>): boolean {
        return !!(
            point.time &&
            point.swellDirection?.[this.stormGlassAPISource] &&
            point.swellHeight?.[this.stormGlassAPISource] &&
            point.swellPeriod?.[this.stormGlassAPISource] &&
            point.waveDirection?.[this.stormGlassAPISource] &&
            point.waveHeight?.[this.stormGlassAPISource] &&
            point.windDirection?.[this.stormGlassAPISource] &&
            point.windSpeed?.[this.stormGlassAPISource]
        );
    }
}
