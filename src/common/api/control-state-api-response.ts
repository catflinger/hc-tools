import { ConfigValidation } from "../config-validation";
import { Program } from "../configuration/program";
import { ControlState } from "../control-state";
import { IControlState, IControlStateApiResponse, IProgram } from "../interfaces";

export class ControlStateApiResponse implements IControlStateApiResponse {
    public readonly controlState: IControlState;
    public date: Date;
    public readonly activeProgram: IProgram;

    constructor(data: any) {
        if (data.date) {
            this.date = ConfigValidation.getDate(data.date, "ControlStateApiResponse: date");
        } else {
            throw new Error("date missing from ControlStateApiResponse");
        }

        if (data.controlState) {
            this.controlState = new ControlState(data.controlState);
        } else {
            throw new Error("controlState missing from ControlStateApiResponse");
        }

        if (data.activeProgram) {
            this.activeProgram = new Program(data.activeProgram);
        } else {
            throw new Error("activeProgram missing from ControlStateApiResponse");
        }
    }
}
