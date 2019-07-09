import { ConfigValidation } from "../config-validation";
import { ITimeOfYear } from "../interfaces";

export class TimeOfYear implements ITimeOfYear {

    public static fromDate(date: Date): ITimeOfYear {
        return new TimeOfYear({month: date.getMonth() + 1, day: date.getDate()});
    }

    public readonly month: number;
    public readonly day: number;

    constructor(data: {month: number, day: number}) {
        this.day = ConfigValidation.getNumber(data.day, "TimeOfYear: day");
        this.month = ConfigValidation.getNumber(data.month, "TimeOfYear: month");

        if (this.month !== Math.trunc(data.month) || this.day !== Math.trunc(data.day)) {
            throw new Error("TimeOfYear: day and month must be integers");
        }

        const daysInMonth: number[] = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (this.month < 1 || this.month > 12) {
            throw new Error("TimeOfYear: month out of bounds");
        }
        if (this.day < 1 || this.day > daysInMonth[this.month]) {
            throw new Error("TimeOfYear: day out of bounds");
        }
    }

    public isToday(date: Date): boolean {
        return this.month === date.getMonth() + 1 && this.day === date.getDate();
    }

    public isSameAs(timeOfYear: ITimeOfYear): boolean {
        return this.month === timeOfYear.month && this.day === timeOfYear.day;
    }

}
