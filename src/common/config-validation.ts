import { RoleType } from "./interfaces";

export class ConfigValidation {

    public static getBoolean(val: any, message: string, defaultValue?: boolean): boolean {
        return getValue("boolean", val, message, defaultValue);
    }

    public static getString(val: any, message: string, defaultValue?: string): string {
        return getValue("string", val, message, defaultValue);
    }

    public static getRoleType(val: any, message: string, defaultValue?: RoleType): RoleType {
        if (val === null || val === undefined || val === "") {
            return null;
        }

        const role = this.getString(val, message, defaultValue);
        if (role !== "hw" && role !== "bedroom") {
            throw new Error(`Config validation, ${message} is not a valid role type`);
        }
        return role;
    }

    public static getNumber(val: any, message: string, defaultValue?: number): number {
        return getValue("number", val, message, defaultValue);
    }

    public static getDate(val: any, message: string, defaultValue?: Date): Date {
        let result: Date;
        const dateExpression: RegExp = new RegExp("^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}");

        if (val instanceof Date && !isNaN(val.getTime())) {
            // already have a good date pased in, no need for any conversions or further checking
            result = val;
        } else if (val === undefined && defaultValue === undefined) {
            // value missing but no default
            throw new Error(`Config validation, cannot find ${message} and no default value supplied`);
        } else if (val !== undefined && typeof val !== "string") {
            // value is present but not the correct type
            throw new Error(`Config validation, value for ${message} is not a string`);
        } else if (val !== undefined && ! dateExpression.test(val)) {
            // string value is present but not the correct format
            throw new Error(`Config validation, value for ${message} is not formatted yyyy-mm-ddThh:mm:ss`);
        } else if (val === undefined && defaultValue !== undefined) {
            // value is missing but we have got a default value
            result = defaultValue;
        } else {
            // value must be present and OK
            result = new Date(val);
            if (isNaN(result.valueOf())) {
                throw new Error(`Config validation, value for ${message} is an invalid date string`);
            }
        }

        return result;
        }
}

function getValue(typeName: string, val: any, message: string, defaultValue?: any): any {
    let result: any;

    if (val === undefined && defaultValue === undefined) {
        // value missing but no default
        throw new Error(`Config validation, cannot find ${message} and no default value supplied`);
    } else if (val !== undefined && typeof val !== typeName) {
        // value is present but not the correct type
        throw new Error(`Config validation, value for ${message} is not ${typeName}`);
    } else if (val === undefined && defaultValue !== undefined) {
        // value is missing but we have got a default value
        result = defaultValue;
    } else {
        // value is resent and of the correct type
        result = val;
    }
    return result;
}
