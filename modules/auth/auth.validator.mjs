import { ExpressError } from "../../utils/custom.error.mjs";
import * as validator from "../../utils/validators.mjs";

export const registerValidationRules = [
    validator.stringRequired("username"),
    validator.stringRequired("password"),
    validator.stringRequired("first_name"),
    validator.stringOptional("last_name"),
    validator.stringOptional("role").custom((val, { req }) => {
        if (
            (val === "admin" || val === "superuser") &&
            req.user.role !== "superuser"
        )
            throw new ExpressError(
                "Unauthorized access, only superuser can create admin/superuser!",
                403,
            );
        return true;
    }),
    validator.emailOptional(),
];

export const loginValidationRules = [
    validator.stringRequired("username"),
    validator.stringRequired("password"),
];
