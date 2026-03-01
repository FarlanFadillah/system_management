import * as validator from "../../utils/validators.mjs";

export const createProsesValidationRules = [
    validator.stringOptional("no_surat"),
    validator.dateOptional("tgl_surat"),
    validator.stringIncludeRequired("status"),
    validator.numericalOptional("produk_id"),
    validator.numericalRequired("alas_hak_id"),
];
