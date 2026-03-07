import * as validator from "../../utils/validators.mjs";
const status = ["DRAFT", "PENDING", "ON PROCESS", "DONE"];

export const createProsesValidationRules = [
    validator.stringOptional("no_surat"),
    validator.dateOptional("tgl_surat"),
    validator.stringIncludeRequired("status", status),
    validator.numericalOptional("produk_id"),
    validator.numericalOptional("alas_hak_id"),
];

export const patchProsesValidationRules = [
    validator.stringOptional("no_surat"),
    validator.dateOptional("tgl_surat"),
    validator.stringIncludeOptional("status", status),
    validator.numericalOptional("produk_id"),
    validator.numericalOptional("alas_hak_id"),
];
