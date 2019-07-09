import { ConfigValidation } from "../config-validation";
import { ILogApiResponse, ILogExtract } from "../interfaces";
import { LogExtract } from "../log/log-extract";

export class LogApiResponse implements ILogApiResponse {
    public readonly log: ILogExtract;
    public readonly date: Date;

    constructor(data: any) {
        if (data.date) {
            this.date = ConfigValidation.getDate(data.date, "LogApiResponse: date");
        } else {
            throw new Error("date missing from LogApiResponse");
        }

        if (data.log) {
            this.log = new LogExtract(data.log);
        } else {
            throw new Error("log array missing from LogApiResponse");
        }
    }
}
