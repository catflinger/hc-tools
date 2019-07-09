export * from "./config-validation";
export * from "./configuration/configuration";
export * from "./configuration/dated-config";
export * from "./configuration/named-config";
export * from "./configuration/override";
export * from "./configuration/program";
export * from "./configuration/sensor-config";
export * from "./configuration/sensor-reading";
export * from "./configuration/time-of-day";
export * from "./control-state";

// import { IConfigValidation } from "./interfaces";

// TypeScript does not allow interface members to be static.  This next export simulates this
// by exporting a concrete instance variable called convfigValidation that implements static methods
// that have the same signature as those in the interface IConfigValidation
// export const configValidation: IConfigValidation = ConfigValidation;
