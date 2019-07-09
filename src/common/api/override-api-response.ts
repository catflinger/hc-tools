import { ConfigValidation } from "../config-validation";
import { Override } from "../configuration/override";
import { IOverride, IOverrideApiResponse } from "../interfaces";

export class OverrideApiResponse implements IOverrideApiResponse {
    public readonly overrides: IOverride[];
    public readonly date: Date;

    constructor(data: any) {
        if (data.date) {
            this.date = ConfigValidation.getDate(data.date, "OverrideApiResponse: date");
        } else {
            throw new Error("date missing from OverrideApiResponse");
        }

        if (data.overrides && Array.isArray(data.overrides)) {
            this.overrides = [];
            data.overrides.forEach((ovData: any) => this.overrides.push(new Override(ovData)));
        } else {
            throw new Error("overrides array missing from OverrideApiResponse");
        }
    }
}
