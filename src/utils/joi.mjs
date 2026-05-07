import Joi, { required } from "joi";

const my_schema = Joi.array().items({
    name: Joi.string().required(),
    type: Joi.string().valid(...Object.keys(Joi.types())),
    required: Joi.boolean().required().default(false),
});

/**
 * Joi schema from json file
 * @param {Array} fields
 * @returns {import("joi").Schema}
 */
function buildJoiSchema(fields) {
    // validate custom schema json
    const schema = validateJsonSchema(fields);

    const result = {};
    for (const field of schema) {
        let j = Joi[field.type]();
        j = field.required ? j.required() : j.optional();
        result[field.name] = j;
    }
    return Joi.object(result);
}

function validateJsonSchema(schema) {
    const { value, error } = my_schema.validate(schema, {
        stripUnknown: true,
    });
    if (error) {
        throw new Error("Invalid schema");
    }
    return value;
}
