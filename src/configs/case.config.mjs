import Joi from "joi";
import db from "../dbs/db.mjs";

const rows = await db("products").select("*");
const CASES = Object.fromEntries(rows.map((row) => [row.id, row]));

export default CASES;

/**
 * 
const rules = Joi.object().keys({
    id: Joi.number().required(),
    name: Joi.string().required(),
    is_transaction: Joi.boolean().truthy(1, "1").falsy(0, "0").required(),
    type_transaction: Joi.string().allow(null),
    roles: Joi.object().allow(null).required(),
});

const [{ PRD }] = await db("products").select(
    db.raw(`
        JSON_OBJECTAGG(id, JSON_OBJECT("id", id, "name", name, 
        "is_transaction", is_transaction, "type_transaction", type_transaction, 
        "roles", roles)) as PRD
    `),
);

const CASES = Object.keys(PRD).map((val) => {
    const { value, error } = rules.validate(PRD[val]);
    if (error) {
        console.error(error.details);
        throw new Error("Products invalid");
    } else return value;
});
*/
