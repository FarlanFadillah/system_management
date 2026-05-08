import Joi from "joi";

const my_schema = Joi.array().items({
    name: Joi.string().required(),
    type: Joi.string().valid(...Object.keys(Joi.types())),
    required: Joi.boolean().required().default(false),
    items: Joi.array().optional(),
    min: Joi.when("items", {
        is: Joi.exist(),
        then: Joi.number().required(),
        otherwise: Joi.forbidden(),
    }),
});

/**
 * Joi schema from custom json configuration file
 * @param {Array} fields
 * @returns {import("joi").Schema}
 */
export function buildJoiSchema(fields) {
    // validate custom schema json
    const schema = validateJsonSchema(fields);

    const rules = {};
    for (const field of schema) {
        let j = Joi[field.type]();
        // for array type
        if (field.items) {
            j = j.items(buildJoiSchema(field.items));
            j = j.min(field.min);
        }

        // required
        j = field.required ? j.required() : j.optional();

        rules[field.name] = j;
    }
    return Joi.object(rules);
}

function validateJsonSchema(schema) {
    const { value, error } = my_schema.validate(schema, {
        stripUnknown: true,
    });
    if (error) throw new Error("Invalid schema");
    return value;
}
