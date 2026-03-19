import * as validator from "../../utils/validators.mjs";

export const addAlasHakValidationRules = [
    validator.stringRequired("no_alas_hak"),
    ["no_surat_ukur", "jor", "ket"].map(validator.stringOptional),
    validator.dateOptional("tgl_alas_hak"),
    validator.dateOptional("tgl_surat_ukur"),
    validator.stringOptional("address_code"),
    validator.numericalRequired("jenis_hak_id"),
    validator.numericalRequired("luas"),
];

export const updateAlasHakValidationRules = [
    validator.stringOptional("no_alas_hak"),
    ["no_surat_ukur", "jor", "ket"].map(validator.stringOptional),
    validator.dateOptional("tgl_alas_hak"),
    validator.dateOptional("tgl_surat_ukur"),
    validator.stringOptional("address_code"),
    validator.numericalOptional("jenis_hak_id"),
    validator.numericalOptional("luas"),
];

export const searchAlasHakValidationRules = [
    validator.stringRequired("keyword"),
    validator.stringOptional("level"),
];

export const IDValidatorRules = [validator.numericalRequired("id")];

export const paginationValidationRules = [
    validator.numericalRequired("currentpage"),
    validator.numericalRequired("limit"),
];

export const addAlasHakOwnerValidationRules = [
    validator.arrayOfNumberRequired("clients_id"),
];

export const removeAlasHakOwnerValidationRules = [
    validator.numericalRequired("id"),
    validator.numericalRequired("client_id"),
];
