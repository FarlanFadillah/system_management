import { check, validationResult } from "express-validator";
import db from "../dbs/db.mjs";
import { ExpressError } from "./custom.error.mjs";

/**
 *
 * @param {String} field
 */
export function stringRequired(field) {
    return check(field)
        .trim()
        .notEmpty()
        .withMessage(`${field} cannon be empty`)
        .matches(/^[^<>]*$/)
        .withMessage(field + " cant contain html element");
}

/**
 *
 * @param {String} field
 */
export function stringOptional(field) {
    return check(field)
        .optional()
        .trim()
        .matches(/^[^<>]*$/)
        .withMessage(field + " cant contain html element");
}

/**
 *
 * @param {String} field
 */
export function numericalOptional(field) {
    return check(field)
        .optional()
        .isNumeric()
        .withMessage(`${field} must be a numeric`);
}

/**
 *
 * @param {String} field
 */
export function numericalRequired(field) {
    return check(field)
        .notEmpty()
        .withMessage(`${field} cannon be empty`)
        .isNumeric()
        .withMessage(`${field} must be a numeric`);
}

/**
 *
 * @param {String} field
 * @returns
 */
export function emailOptional(field = "email") {
    return check(field)
        .optional()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail();
}

/**
 *
 * @param {String} field
 * @returns
 */
export function emailRequired(field = "email") {
    return check(field)
        .notEmpty()
        .withMessage(`${field} cannon be empty`)
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail();
}

/**
 *
 * @param {String} field
 * @returns
 */
export function dateOptional(field) {
    return check(field).optional().isDate().withMessage("Invalid date");
}

/**
 *
 * @param {String} field
 * @returns
 */
export function dateRequired(field) {
    return check(field).optional().isDate().withMessage("Invalid date");
}

/**
 *
 * @param {String} field
 * @returns
 */
export function addressRequired(field) {
    return check(field).custom(async (value) => {
        const address = await db("kelurahan").where({ id: value });
        if (address.length <= 0) throw new Error("Invalid address code");
    });
}

/**
 *
 * @param {String} field
 * @returns
 */
export function addressOptional(field) {
    return check(field)
        .optional()
        .custom(async (value) => {
            const address = await db("kelurahan").where({ id: value });
            if (address.length <= 0) throw new Error("Invalid address code");
        });
}

/**
 *
 * @param {String} field
 * @returns
 */
export function arrayOfNumberRequired(field) {
    return check(field)
        .notEmpty()
        .withMessage(`${field} cannon be empty`)
        .isArray({ min: 1 })
        .withMessage(`${field} must be an array`)
        .custom(async (value, { req }) => {
            try {
                value.forEach((val) => {
                    if (isNaN(val))
                        throw new ExpressError("The elements is not number");
                });
            } catch (error) {
                throw new ExpressError(`${field} must be an array`);
            }
        });
}
