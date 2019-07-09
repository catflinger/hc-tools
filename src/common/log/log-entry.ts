import { ConfigValidation } from "../config-validation";
import { ILogEntry } from "../interfaces";

export class LogEntry implements ILogEntry {
    public readonly date: Date;
    public readonly heating: boolean;
    public readonly hotWater: boolean;
    public readonly readings: ReadonlyArray<number>;

    constructor(data: any) {
        this.date = ConfigValidation.getDate(data.date, "LogEntry.date");
        this.heating = ConfigValidation.getBoolean(data.heating, "LogEntry.heating");
        this.hotWater = ConfigValidation.getBoolean(data.hotWater, "LogEntry.hotWater");
        const readings: number[] = [];

        data.readings.forEach((reading: any) => {
            readings.push(ConfigValidation.getNumber(reading, "LogEntry.readings"));
        });

        this.readings = readings;
    }
}
