import * as validator from "../../utils/validators.mjs";

export const addAlasHakValidationRules = [
    validator.stringRequired("no_alas_hak"),
    validator.stringOptional("no_surat_ukur"),
    validator.stringOptional("jor"),
    validator.stringOptional("ket"),
    validator.dateOptional("tgl_alas_hak"),
    validator.dateOptional("tgl_surat_ukur"),
    validator.stringOptional("address_code"),
    validator.numericalRequired("type_id"),
    validator.numericalRequired("luas"),
];

export const updateAlasHakValidationRules = [
    validator.stringOptional("no_alas_hak"),
    validator.stringOptional("no_surat_ukur"),
    validator.stringOptional("jor"),
    validator.stringOptional("ket"),
    validator.dateOptional("tgl_alas_hak"),
    validator.dateOptional("tgl_surat_ukur"),
    validator.stringOptional("address_code"),
    validator.numericalOptional("type_id"),
    validator.numericalOptional("luas"),
];

export const searchAlasHakValidationRules = [
    validator.stringOptional("address_code", "query"),
    validator.numericalOptional("nomor", "query"),
];

export const addAlasHakOwnerValidationRules = [
    validator.arrayOfNumberRequired("clients_id"),
];

export const removeAlasHakOwnerValidationRules = [
    validator.numericalRequired("id", "param"),
    validator.numericalRequired("client_id", "param"),
];
