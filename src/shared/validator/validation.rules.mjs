import * as validator from "../utils/validators.mjs";

export const IDValidationRules = [validator.numericalRequired("id", "param")];

export const paginationValidationRules = [
    validator.intOptional("currentpage", "query", 1).default(1),
    validator.intOptional("limit", "query", 1, 25).default(10),
];

export const dateRangeValidationRules = [
    validator.stringRequired("from", "query"),
    validator.stringRequired("to", "query"),
];
