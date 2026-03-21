import * as validator from "../../utils/validators.mjs";
// {
//     "no_akta": "01",
//     "tgl_akta": "2026-03-03",
//     "proses_id": 0,
//     "produk_id": 0,
//     "saksi1_id": 0,
//     "saksi2_id": 1,
// }

export const createAktaValidationRules = [
    validator.stringOptional("no_akta"),
    validator
        .stringOptional("tahun_akta")
        .isLength({ min: 4, max: 4 })
        .withMessage("Invalid value for `Tahun Akta`"),
    validator.dateOptional("tgl_akta"),
    validator.numericalRequired("proses_id"),
    validator.numericalRequired("produk_id"),
    validator.numericalOptional("saksi1_id"),
    validator.numericalOptional("saksi2_id"),
];

export const updateAktaValidationRules = [
    validator.stringOptional("no_akta"),
    validator
        .stringOptional("tahun_akta")
        .isLength({ min: 4, max: 4 })
        .withMessage("Invalid value for `Tahun Akta`"),
    validator.dateOptional("tgl_akta"),
    validator.numericalOptional("proses_id"),
    validator.numericalOptional("produk_id"),
    validator.numericalOptional("saksi1_id"),
    validator.numericalOptional("saksi2_id"),
];

export const numberAktaValidationRules = [validator.stringRequired("value")];
