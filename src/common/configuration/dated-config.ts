import { ConfigValidation } from "../config-validation";
import { IDatedConfig } from "../interfaces";
import { TimeOfYear } from "./time-of-year";

export class DatedConfig implements IDatedConfig {
    public readonly programId: string;
    public readonly timeOfYear: TimeOfYear;

    constructor(data: any) {
        this.programId = ConfigValidation.getString(data.programId, "datedConfig:programId");
        this.timeOfYear = new TimeOfYear(data.timeOfYear);
    }
}
