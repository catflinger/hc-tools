import { ConfigValidation } from "../config-validation";
import { SensorReading } from "../configuration/sensor-reading";
import { ISensorApiResponse, ISensorReading } from "../interfaces";

export class SensorApiResponse implements ISensorApiResponse {
    public readonly sensors: ISensorReading[];
    public readonly date: Date;

    constructor(data: any) {
        if (data.date) {
            this.date = ConfigValidation.getDate(data.date, "SensorApiResponse: date");
        } else {
            throw new Error("date missing from SensorApiResponse");
        }

        if (data.sensors && Array.isArray(data.sensors)) {
            this.sensors = [];
            data.sensors.forEach((readingData: any) => this.sensors.push(new SensorReading(readingData)));
        } else {
            throw new Error("sensors array missing from SensorApiResponse");
        }
    }
}
