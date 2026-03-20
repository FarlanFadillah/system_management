import * as validator from "../../utils/validators.mjs";

export const createClientValidationRules = [
    validator
        .stringRequired("nik")
        .isLength({ min: 16, max: 16 })
        .withMessage("NIK lenght must be 16 characters"),
    validator.stringRequired("first_name"),
    validator.stringOptional("last_name"),
    validator.dateRequired("birth_date"),
    validator.stringRequired("birth_place"),
    validator.stringRequired("job_name"),
    validator.addressRequired("address_code"),
    validator.stringRequired("marriage_status"),
    validator.stringRequired("gender"),
    validator.stringOptional("address"),
    validator.numericalOptional("rt"),
    validator.numericalOptional("rw"),
    validator.mobilePhoneOptional("phone_number"),
];

export const patchClientValidationRules = [
    validator.numericalOptional("nik").isLength({ min: 16, max: 16 }),
    validator.stringOptional("first_name"),
    validator.stringOptional("last_name"),
    validator.dateOptional("birth_date"),
    validator.stringOptional("birth_place"),
    validator.stringOptional("job_name"),
    validator.addressOptional("address_code"),
    validator.stringOptional("marriage_status"),
    validator.stringOptional("gender"),
    validator.stringOptional("address"),
    validator.numericalOptional("rt"),
    validator.numericalOptional("rw"),
    validator.mobilePhoneOptional("phone_number"),
];

export const IDValidationRules = [validator.numericalRequired("id")];

export const paginationValidationRules = [
    validator.numericalRequired("currentpage"),
    validator.numericalRequired("limit"),
];

export const searchValidationRules = [validator.stringRequired("keyword")];
