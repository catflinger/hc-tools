import { ConfigValidation } from "./config-validation";
import { IControlState } from "./interfaces";

export class ControlState implements IControlState {
    public readonly heating: boolean;
    public readonly hotWater: boolean;

    constructor(data: any) {
        this.heating = ConfigValidation.getBoolean(data.heating, "ControlState:heating");
        this.hotWater = ConfigValidation.getBoolean(data.hotWater, "ControlState:hotWater");
    }
}
