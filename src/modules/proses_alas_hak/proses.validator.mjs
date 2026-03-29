import * as validator from "../../utils/validators.mjs";
const status = ["DRAFT", "PENDING", "ON PROCESS", "DONE"];

export const IDValidationRules = [validator.numericalRequired("id")];

export const createProsesValidationRules = [
    validator.stringOptional("no_surat"),
    validator.dateOptional("tgl_surat"),
    validator.stringIncludeRequired("status", status),
    validator.numericalOptional("produk_id"),
    validator.numericalRequired("alas_hak_id"),
];

export const patchProsesValidationRules = [
    validator.stringOptional("no_surat"),
    validator.dateOptional("tgl_surat"),
    validator.stringIncludeOptional("status", status),
    validator.numericalOptional("produk_id"),
    validator.numericalOptional("alas_hak_id"),
];

export const clientRolesValidationRules = [
    validator.arrayOfNumberRequired("clients_id"),
    validator.numericalRequired("roles_id"),
];

export const removeClientRolesValidationRules = [
    validator.numericalRequired("client_id", "param"),
];

export const paginationValidationRules = [
    validator.numericalRequired("currentpage", "query"),
    validator.numericalRequired("limit", "query"),
];

export const searchValidationRules = [
    validator.dateRequired("from", "query"),
    validator.dateRequired("to", "query"),
    validator.stringOptional("number", "query"),
];

export const nomorSuratValidationRules = [
    validator.stringRequired("value", "param"),
];

export const rolesNameValidationRules = [
    validator.stringRequired("name", "query"),
];
