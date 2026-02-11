import {check, validationResult} from "express-validator";

/**
 * 
 * @param {String} name
 */
export function stringNotNullable(name){
    return check(name)
    .notEmpty().withMessage(`${name} cannon be empty`)
    .trim()
    .escape()
}

/**
 * 
 * @param {String} name 
 */
export function stringNullable(name){
    return check(name)
    .optional()
    .trim()
    .escape()
}

/**
 * 
 * @param {String} name 
 */
export function numerical(name){
    return check(name)
    .isNumeric().withMessage(`${name} must be a numeric`)
    .escape()
}

/**
 * 
 * @param {String} name 
 */
export function isPhoneNumber(name){
    return check(name)
    .optional()
    .isMobilePhone("en-IN").withMessage(`${name} is not mobile phone number`)
}


export function validatorErrorHandler(req, res, next){
    const result = validationResult(req);
    
    if(!result.isEmpty()){
        res.json({success : false, msg : "Validation failed",
            target : [result.errors.map((obj) => obj.msg)]
        })
    }
    next();
}