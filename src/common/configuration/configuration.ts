import { IConfiguration, IConfigurationM, IDatedConfig, INamedConfig, IProgram, ISensorConfig } from "../interfaces";
import { DatedConfig } from "./dated-config";
import { NamedConfig } from "./named-config";
import { Program } from "./program";
import { SensorConfig } from "./sensor-config";

export class Configuration implements IConfiguration {
    private programConfig: IProgram[] = [];
    private sensorConfig: ISensorConfig[] = [];
    private datedConfig: IDatedConfig[] = [];
    private namedConfig: INamedConfig;

    constructor(data: any) {

        if (data) {
            if (data.programConfig) {
                if (Array.isArray(data.programConfig)) {
                    data.programConfig.forEach((p: any) => {
                        this.programConfig.push(new Program(p));
                    });
                } else {
                    throw new Error("invalid config: programs not an array");
                }
            }
            if (data.datedConfig) {
                if (Array.isArray(data.datedConfig)) {
                    data.datedConfig.forEach((dc: any) => {
                        this.datedConfig.push(new DatedConfig(dc));
                    });
                } else {
                    throw new Error("invalid config: datedConfig not an array");
                }
            }
            if (data.namedConfig) {
                this.namedConfig = new NamedConfig(data.namedConfig);
            } else {
                throw new Error("no named config supplied");
            }
            if (data.sensorConfig) {
                if (Array.isArray(data.sensorConfig)) {
                    data.sensorConfig.forEach((dp: any) => {
                        this.sensorConfig.push(new SensorConfig(dp));
                    });
                } else {
                    throw new Error("invalid config: datedConfig not an array");
                }
            }
        } else {
            throw new Error("no config supplied");
        }
    }

    public toJSON(): any {
        return {
            datedConfig: this.datedConfig,
            namedConfig: this.namedConfig,
            programConfig: this.programConfig,
            sensorConfig: this.sensorConfig,
        };
    }

    public getProgramConfig(): ReadonlyArray<IProgram> {
        return this.programConfig as ReadonlyArray<IProgram>;
    }

    public getDatedConfig(): ReadonlyArray<IDatedConfig> {
        return this.datedConfig as ReadonlyArray<IDatedConfig>;
    }

    public getSensorConfig(): ReadonlyArray<ISensorConfig> {
        return this.sensorConfig as ReadonlyArray<ISensorConfig>;
    }

    public getNamedConfig(): INamedConfig {
        return this.namedConfig;
    }

    public toMutable(): IConfigurationM {
        return JSON.parse(JSON.stringify(this));
    }
}
