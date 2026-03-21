import * as validator from "../utils/validators.mjs";

export const IDValidationRules = [validator.numericalRequired("id")];

export const paginationValidationRules = [
    validator.intRequired("currentpage", 1),
    validator.intRequired("limit", 1, 25),
];

export const dateRangeValidationRules = [
    validator.stringRequired("from"),
    validator.stringRequired("to"),
];
