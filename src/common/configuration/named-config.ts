import { ConfigValidation } from "../config-validation";
import { INamedConfig } from "../interfaces";

export class NamedConfig implements INamedConfig {
    public readonly weekdayProgramId: string;
    public readonly saturdayProgramId: string;
    public readonly sundayProgramId: string;

    constructor(data: any) {
        this.weekdayProgramId = isPresent(data.weekdayProgramId) ?
            ConfigValidation.getString(data.weekdayProgramId, "namedConfig:weekdayProgramId", null) :
            "";

        this.saturdayProgramId = isPresent(data.saturdayProgramId) ?
            ConfigValidation.getString(data.saturdayProgramId, "namedConfig:saturdayProgramId", null) :
            "";

        this.sundayProgramId = isPresent(data.sundayProgramId) ?
            ConfigValidation.getString(data.sundayProgramId, "namedConfig:sundayProgramId", null) :
            "";
    }

    public toJSON(): any {
        return {
            saturdayProgramId: this.saturdayProgramId,
            sundayProgramId: this.sundayProgramId,
            weekdayProgramId: this.weekdayProgramId,
        };
    }
}

function isPresent(val: any): boolean {
    return !(val === null || val === undefined);
}
