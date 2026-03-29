import * as validator from "../utils/validators.mjs";

export const IDValidationRules = [validator.numericalRequired("id")];

export const paginationValidationRules = [
    validator.intRequired("currentpage", "query", 1),
    validator.intRequired("limit", "query", 1, 25),
];

export const dateRangeValidationRules = [
    validator.stringRequired("from", "query"),
    validator.stringRequired("to", "query"),
];
