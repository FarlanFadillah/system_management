import db from "../../dbs/db.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";
import createDebug from "debug";
import TABLE from "../../configs/table.config.mjs";
import * as rand from "../../utils/randString.mjs";
const debug = new createDebug("app:repo:cases");

// {
//   "case_num" : "001/PPAT-WK/III/2026",
//   "case_date" : "2026-03-01",
//   "status" : "DRAFT",
//   "prd_id" : 1,
//   "ah_id" : 3
// }

/**
 *
 * @param {Object} model
 * @param {import("knex").Knex.Transaction} trx
 * @returns
 */
export async function createCase(model, trx) {
    try {
        // debug("Model : ", JSON.stringify(model));
        const { clients, ...caseData } = model;
        debug("Check case conflicts");
        const conflict = await trx(TABLE.CASES)
            .where({ ah_id: caseData.ah_id })
            .andWhereRaw(`status IN ('IN PROGRESS', 'DRAFT')`)
            .first();
        if (conflict) {
            debug("Conflict detected");
            throw new ExpressError(
                `Alas Hak masih terikat dengan case yang sedang berlangsung (case id ${conflict.id})`,
                400,
            );
        }

        debug("creating case");
        const [id] = await trx(TABLE.CASES).insert({
            ...caseData,
            code: rand.genStringCaps(5, 5),
            created_at: new Date(),
            updated_at: new Date(),
        });

        debug("Log activity");
        await trx(TABLE.$CASES.LOGS).insert({
            case_id: id,
            action: "Case created",
        });
        return id;
    } catch (error) {
        throw new ExpressError(
            error.message,
            error.http_status || 400,
            error.code || "something broke",
        );
    }
}

/**
 *
 * @param {Number} case_id
 * @param {Number} prd_id
 * @param {import("knex").Knex.Transaction} trx
 * @returns
 */
export async function createSteps(case_id, prd_id, trx) {
    try {
        debug("Get Workflows");
        const workflows = await trx(TABLE.WORKFLOWS).where({
            prd_id: prd_id,
        });

        const steps = workflows
            .sort((a, b) => a.order - b.order)
            .map((val, index) => ({
                case_id: case_id,
                step_id: val.id,
                name: val.name,
                status: index === 0 ? "IN PROGRESS" : "DRAFT",
                required_fields: val.required_fields,
            }));

        if (steps.length <= 0)
            throw new ExpressError(
                "Workflows for this product does not exists",
            );

        debug("Initiate steps");
        const [insertedID] = await trx(TABLE.$CASES.STEPS).insert(steps);

        return insertedID;
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {Number} id
 * @param {import("knex").Knex.Transaction} trx
 * @returns
 */
export async function getStep(id, trx) {
    try {
        if (!trx) trx = db;
        return await trx(`${TABLE.$CASES.STEPS} as cs`)
            .where("cs.id", id)
            .first();
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 * @param {Number} case_id
 * @param {Number} current_step_id
 * @param {import("knex").Knex.Transaction} trx
 */
export async function getNextStep(case_id, current_step_id, trx) {
    try {
        if (!trx) trx = db;
        const current_step = await trx(TABLE.$CASES.STEPS)
            .where({
                id: current_step_id,
            })
            .first();
        if (!current_step)
            throw new ExpressError("Current step does not exists", 404);

        return await trx(TABLE.$CASES.STEPS)
            .where({ case_id: case_id })
            .andWhere("step_id", ">", current_step.step_id)
            .first();
    } catch (error) {
        throw new ExpressError(error.message, error.http_status || 400);
    }
}

/**
 *
 * @param {Number} case_id
 * @param {Array} clients
 * @param {import("knex").Knex.Transaction} trx
 */
export async function setClients(case_id, clients, trx) {
    if (!clients) throw new ExpressError("Clients is empty", 400);
    debug("create client case");
    const case_clients = clients.map((val) => ({
        case_id: case_id,
        client_id: val.id,
        roles_id: val.roles_id,
    }));
    await trx(TABLE.$CASES.CLIENTS).insert(case_clients);
}

/**
 *
 * @param {Number} id
 * @param {import("knex").Knex.Transaction} trx
 */
export async function lockForUpdate(id, trx) {
    try {
        await trx(TABLE.CASES).where({ id: id }).forUpdate().select("*");
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {Number} id
 * @param {Object} data
 * @param {import("knex").Knex.Transaction} trx
 */
export async function updateCase(id, data, trx) {
    try {
        await trx(TABLE.CASES)
            .where("id", id)
            .update({ ...data, updated_at: trx.fn.now() });
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {Number} id
 * @param {Object} data
 * @param {import("knex").Knex.Transaction} trx
 */
export async function updateStep(id, data, trx) {
    try {
        await trx(TABLE.$CASES.STEPS).where({ id: id }).forUpdate().select("*");
        await trx(TABLE.$CASES.STEPS)
            .where({ id: id })
            .update({ ...data });
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function log(trx, id, action) {
    try {
        await trx(TABLE.$CASES.LOGS).insert({
            case_id: id,
            action: action,
        });
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 * Get related client from case for bphtb
 * @param {Number} case_id
 * @param {Number} role_id
 * @returns {Object}
 */
export async function getClientIdsFromCase(case_id, role_id) {
    try {
        return await db(`${TABLE.CASES} as c`)
            .leftJoin(`${TABLE.$CASES.CLIENTS} as cc`, "cc.case_id", "c.id")
            .leftJoin(`${TABLE.CLIENTS} as cl`, "cl.id", "cc.client_id")
            .where("c.id", case_id)
            .andWhere("cc.roles_id", role_id)
            .select("cl.id");
    } catch (error) {
        throw error;
    }
}

export async function getCaseById(id) {
    try {
        return await db(TABLE.CASES).select("*").where({ id }).first();
    } catch (error) {
        throw error;
    }
}

/**
 *
 * @param {Number} id
 * @param {import("knex").Knex.Transaction} trx
 * @returns
 */
export async function getById(id, trx) {
    try {
        if (!trx) trx = db;
        const [[data]] = await trx.raw(`
            SELECT c.*,
            (SELECT JSON_OBJECT("id", ah.id, "no_alas_hak", ah.no_alas_hak) 
                FROM ${TABLE.ALASHAK} AS ah WHERE ah.id = c.ah_id
            ) AS alas_hak,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT("id", cl.id, "first_name", cl.first_name, "last_name", cl.last_name, "role", cr.name))
                FROM ${TABLE.$CASES.CLIENTS} as cc LEFT JOIN ${TABLE.CLIENTS} AS cl on cl.id = cc.client_id 
                LEFT JOIN ${TABLE.$CLIENTS.ROLES} as cr on cr.id = cc.roles_id
                WHERE cc.case_id = c.id
            ) AS clients,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT("id", cs.id, "status", cs.status, "name", wf.name, "is_active",
                CASE
                    WHEN cs.id = c.current_step THEN 1
                    ELSE 0
                END,
                "valid", cs.valid,
                "required_fields", cs.required_fields
            )) FROM ${TABLE.$CASES.STEPS} as cs
                LEFT JOIN ${TABLE.WORKFLOWS} AS wf on wf.id = cs.step_id
                WHERE cs.case_id = c.id
            ) as case_steps,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT("action", al.action, "level", al.level, "timestamp", al.timestamp)) 
            FROM ${TABLE.$CASES.LOGS} as al
            WHERE al.case_id = c.id
            ) as activities
            FROM ${TABLE.CASES} AS c WHERE c.id = ${id} LIMIT 1;
        `);

        return data;
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function getFilteredCases(limit, offset, filters) {
    try {
        const data = await db(`${TABLE.CASES} as c`)
            .select(["c.id", "c.code", "c.status", "prd.name as products"])
            .select(
                db.raw(
                    `JSON_OBJECT('id', ah.id, 'nomor', ah.no_alas_hak) as alas_hak`,
                ),
            )
            .leftJoin(`${TABLE.$CASES.PRD} as prd`, "prd.id", "c.prd_id")
            .leftJoin(`${TABLE.ALASHAK} as ah`, "ah.id", "c.ah_id")
            .where("c.code", "like", `${filters.code || ""}%`)
            .modify(function (queryBuilder) {
                if (filters.from) {
                    queryBuilder.andWhere(
                        "c.created_at",
                        ">=",
                        `${filters.from}`,
                    );
                }
                if (filters.to) {
                    queryBuilder.andWhere(
                        "c.created_at",
                        "<=",
                        `${filters.to}`,
                    );
                }
            })
            .limit(limit)
            .offset(offset);

        const [{ count }] = await db(`${TABLE.CASES} as c`)
            .where("c.code", "like", `${filters.code || ""}%`)
            .modify(function (queryBuilder) {
                if (filters.from) {
                    queryBuilder.andWhere(
                        "c.created_at",
                        ">=",
                        `${filters.from}`,
                    );
                }
                if (filters.to) {
                    queryBuilder.andWhere(
                        "c.created_at",
                        "<=",
                        `${filters.to}`,
                    );
                }
            })
            .count("id as count");
        return { data, count };
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {Number} limit
 * @param {Number} offset
 * @returns
 */
export async function getAll(limit, offset) {
    try {
        const data = await db(`${TABLE.CASES} as c`)
            .leftJoin(`${TABLE.$CASES.PRD} as prd`, "prd.id", "c.prd_id")
            .select(["c.id", "c.code", "c.status", "prd.name as products"])
            .limit(limit)
            .offset(offset);

        const [{ count }] = await db(TABLE.CASES).count("id as count");
        return { data, count };
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {String} key
 * @param {String} value
 */
export async function searchBy(key, value, limit, offset) {
    try {
        const data = await db(`${TABLE.CASES} as c`)
            .leftJoin(`${TABLE.$CASES.PRD} as prd`, "prd.id", "c.prd_id")
            .where(`c.${key}`, "like", `%${value}%`)
            .select([
                "c.id",
                "c.case_num",
                "c.case_date",
                "prd.name as products",
            ])
            .limit(limit)
            .offset(offset);

        const [{ count }] = await db(TABLE.CASES)
            .where(key, "like", `%${value}%`)
            .count("* as count");

        return { data, count };
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {Number} limit
 * @param {Number} offset
 * @param {String} from
 * @param {String} to
 * @param {String} code
 * @returns
 */
export async function searchByDate(limit, offset, from, to, code) {
    try {
        const data = await db("cases")
            .whereBetween("created_at", [from, to])
            .select(["id", "code", "case_date"])
            .limit(limit)
            .offset(offset);

        const [{ count }] = await db("cases")
            .whereBetween("case_date", [from, to])
            .count("id as count");

        return { data, count };
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function getRoles() {
    try {
        return await db("client_roles").select(["id", "name"]);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

/**
 *
 * @param {Number} id
 * @param {import("knex").Knex.Transaction} trx
 * @returns
 */
export async function getProduct(id, trx) {
    try {
        return await trx(TABLE.$CASES.PRD).where({ id: id }).first();
    } catch (error) {
        throw error;
    }
}
