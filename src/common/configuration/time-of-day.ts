import { ConfigValidation } from "../config-validation";
import { ITimeOfDay } from "../interfaces";

export class TimeOfDay implements ITimeOfDay {

    private static fromSeconds(totalSeconds: number): ITimeOfDay {
        // tidy up the input value to a reasonable positive innteger
        totalSeconds = Math.floor(totalSeconds);
        totalSeconds = Math.max(0, totalSeconds);
        totalSeconds = Math.min(24 * 60 * 60 - 1, totalSeconds);

        const hour: number = Math.floor(totalSeconds / (60 * 60));
        const minute: number = Math.floor((totalSeconds - hour * 60 * 60) / 60);
        const second: number = Math.floor(totalSeconds - hour * 60 * 60 - minute * 60);

        return new TimeOfDay({ hour, minute, second });
    }

    public readonly hour: number = NaN;
    public readonly minute: number = NaN;
    public readonly second: number = NaN;

    constructor(data: string | { hour: number, minute: number, second: number }) {
        if (typeof data === "string") {
            if (/^\d{1,2}:\d{1,2}:\d{1,2}$/.test(data)) {
                const parts: string[] = data.split(":");
                this.hour = parseInt(parts[0], 10);
                this.minute = parseInt(parts[1], 10);
                this.second = parseInt(parts[2], 10);
            }
        } else {
            this.hour = Math.floor(ConfigValidation.getNumber(data.hour, "timeOfDayConfig:hour"));
            this.minute = Math.floor(ConfigValidation.getNumber(data.minute, "timeOfDayConfig:minute"));
            this.second = Math.floor(ConfigValidation.getNumber(data.second, "timeOfDayConfig:second", 0));
        }

        if (isNaN(this.hour) || this.hour < 0 || this.hour > 23) {
            throw new Error(`TimeOfDay: value [${this.hour}] for hour outside range`);
        }

        if (isNaN(this.minute) || this.minute < 0 || this.minute > 59) {
            throw new Error(`TimeOfDay: value [${this.minute}] for minute outside range`);
        }

        if (isNaN(this.second) || this.second < 0 || this.second > 59) {
            throw new Error(`TimeOfDay: value [${this.second}] for second outside range`);
        }
    }

    public isLaterThan(other: ITimeOfDay): boolean {
        let result: boolean;

        if (this.hour > other.hour) {
            result = true;
        } else if (this.hour < other.hour) {
            result = false;
        } else if (this.minute > other.minute) {
            result = true;
        } else if (this.minute < other.minute) {
            result = false;
        } else if (this.second > other.second) {
            result = true;
        } else {
            result = false;
        }

        return result;
    }

    public isSameAs(other: ITimeOfDay): boolean {
        return this.hour === other.hour &&
            this.minute === other.minute &&
            this.second === other.second;
    }

    public isEarlierThan(other: ITimeOfDay): boolean {
        return !this.isSameAs(other) && !this.isLaterThan(other);
    }

    public addHours(hours: number): ITimeOfDay {
        return TimeOfDay.fromSeconds(this.toSeconds() + hours * 60 * 60);
    }

    public addMinutes(minutes: number): ITimeOfDay {
        return TimeOfDay.fromSeconds(this.toSeconds() + minutes * 60);
    }

    public addSeconds(seconds: number): ITimeOfDay {
        return TimeOfDay.fromSeconds(this.toSeconds() + seconds);
    }

    public toSeconds(): number {
        return this.hour * 60 * 60 + this.minute * 60 + this.second;
    }

    public toString(): string {
        return `${this.as2d(this.hour)}:${this.as2d(this.minute)}:${this.as2d(this.second)}`;
    }

    public justBefore(): ITimeOfDay {
        let seconds: number = this.toSeconds();

        if (seconds > 0) {
            seconds = seconds - 1;
        }
        return  TimeOfDay.fromSeconds(seconds - 1);
    }

    private as2d(n: number): string {
        n = Math.abs(Math.trunc(n));
        const s: string = "0" + n;
        return s.substr(s.length - 2, 2);
    }
}
