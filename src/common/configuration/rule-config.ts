import { v4 as uuid } from "uuid";

import { ConfigValidation } from "../config-validation";
import { IRuleConfig, ITimeOfDay, RoleType } from "../interfaces";
import { TimeOfDay } from "./time-of-day";

/* Base class for implementing rules */

export class RuleConfig implements IRuleConfig {
    public readonly id: string;
    public readonly startTime: ITimeOfDay;
    public readonly endTime: ITimeOfDay;
    public readonly role?: RoleType;
    public readonly temp?: number;

    constructor(data: any) {
        this.id = data.id ?
            ConfigValidation.getString(data.id, "id not valid in RuleConfig configuration") :
            uuid();

        if (data.startTime) {
            this.startTime = new TimeOfDay(data.startTime);
        } else {
            throw new Error("startTime not found in rule config");
        }

        if (data.endTime) {
            this.endTime = new TimeOfDay(data.endTime);
        } else {
            throw new Error("endTime not found in rule config");
        }

        if (this.startTime.isLaterThan(this.endTime)) {
            throw new Error("start time cannot be later than end time in TimeOfDay");
        }

        this.role = data.role ? ConfigValidation.getRoleType(data.role, "RuleConfig:role") : null;
        this.temp = data.temp ? ConfigValidation.getNumber(data.temp, "RuleConfig:temp") : NaN;
    }
}
