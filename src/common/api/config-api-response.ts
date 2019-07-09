import { ConfigValidation } from "../config-validation";
import { Configuration } from "../configuration/configuration";
import { IConfigApiResponse, IConfiguration } from "../interfaces";

export class ConfigApiResponse implements IConfigApiResponse {
    public readonly config: IConfiguration;
    public date: Date;

    constructor(data: any) {
        if (data.date) {
            this.date = ConfigValidation.getDate(data.date, "ConfigApiResponse: date");
        } else {
            throw new Error("date missing from ConfigApiResponse");
        }

        if (data.config) {
            this.config = new Configuration(data.config);
        } else {
            throw new Error("config missing from ConfigApiResponse");
        }

    }
}
