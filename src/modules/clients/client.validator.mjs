import * as validator from "../../utils/validators.mjs";

export const createClientValidationRules = [
    validator
        .numericalRequired("nik")
        .isLength({ min: 16, max: 16 })
        .withMessage("NIK lenght must be 16 characters"),
    validator
        .numericalOptional("nkk")
        .isLength({ min: 16, max: 16 })
        .withMessage("NKK lenght must be 16 characters"),
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
    validator.booleanOptional("is_deceased"),
];

export const patchClientValidationRules = [
    validator
        .numericalOptional("nik")
        .isLength({ min: 16, max: 16 })
        .withMessage("NIK lenght must be 16 characters"),
    validator
        .numericalOptional("nkk")
        .isLength({ min: 16, max: 16 })
        .withMessage("NKK lenght must be 16 characters"),
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

export const searchValidationRules = [
    validator.stringRequired("keyword", "query"),
];
