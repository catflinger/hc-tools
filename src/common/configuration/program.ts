import { v4 as uuid } from "uuid";

import { ConfigValidation } from "../config-validation";
import { IProgram, IProgramM, IRuleConfig } from "../interfaces";
import { RuleConfig } from "./rule-config";

export class Program implements IProgram {
    public readonly id: string;
    public readonly name: string;
    public readonly minHwTemp: number;
    public readonly maxHwTemp: number;

    private rules: IRuleConfig[] = [];

    constructor(data?: any) {
        if (data) {
            this.id = ConfigValidation.getString(data.id, "programConfig:id");
            this.name = ConfigValidation.getString(data.name, "programConfig:name");
            this.minHwTemp = ConfigValidation.getNumber(data.minHwTemp, "programConfig:minHwTemp");
            this.maxHwTemp = ConfigValidation.getNumber(data.maxHwTemp, "programConfig:maxHwTemp");

            if (this.minHwTemp < 0 || this.minHwTemp > 60 || isNaN(this.minHwTemp)) {
                throw new Error("invalid configuration value for minHwTemp");
            }

            if (this.maxHwTemp < 0 || this.maxHwTemp > 90 || isNaN(this.maxHwTemp)) {
                throw new Error("invalid configuration value for maxHwTemp");
            }

            if (this.maxHwTemp - this.minHwTemp < 5) {
                throw new Error("minHwTemp and maxHwTemp must be at least 5 degrees apart");
            }

            if (data.rules) {
                if (Array.isArray(data.rules)) {
                    data.rules.forEach((r: any) => {
                        this.rules.push(new RuleConfig(r));
                    });
                } else {
                    throw new Error("invalid config: datedConfig not an array");
                }
            }
        } else {
            this.id = uuid();
            this.name = "new program";
            this.minHwTemp = 40;
            this.maxHwTemp = 50;
        }
    }

    public toJSON(): any {
        return {
            id: this.id,
            maxHwTemp: this.maxHwTemp,
            minHwTemp: this.minHwTemp,
            name: this.name,
            rules: this.rules,
        };
    }

    public getRules(): ReadonlyArray<IRuleConfig> {
        return this.rules as ReadonlyArray<IRuleConfig>;
    }

    public toMutable(): IProgramM {
        return JSON.parse(JSON.stringify(this));
    }
}
