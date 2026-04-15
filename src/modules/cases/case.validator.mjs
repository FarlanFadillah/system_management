import * as validator from "../../utils/validators.mjs";
const status = ["DRAFT", "PENDING", "IN PROGRESS", "DONE", "REJECTED"];

export const IDValidationRules = [validator.numericalRequired("id", "param")];

export const createProsesValidationRules = [
    validator.numericalRequired("prd_id"),
    validator.numericalRequired("ah_id"),
    ...validator.isArrayOfObjects("clients"),
];

export const patchProsesValidationRules = [
    validator.stringIncludeOptional("status", status),
    validator.numericalOptional("produk_id"),
    validator.numericalOptional("alas_hak_id"),
    validator.numericalOptional("current_step"),
];

export const nextStepValidationRules = [
    validator.dateOptional("tgl_survei"),
    validator.numericalOptional("hasil_survei"),
];

export const stepsValidationRules = [
    validator.stringIncludeOptional("status", status, "body"),
];

export const clientRolesValidationRules = [
    validator.arrayOfNumberRequired("clients_id"),
    validator.numericalRequired("roles_id"),
];

export const removeClientRolesValidationRules = [
    validator.numericalRequired("client_id", "param"),
];

export const searchValidationRules = [
    validator.dateRequired("from", "query"),
    validator.dateRequired("to", "query"),
    validator.stringOptional("code", "query"),
];

export const nomorSuratValidationRules = [
    validator.stringRequired("value", "param"),
];

export const rolesNameValidationRules = [
    validator.stringRequired("name", "query"),
];
