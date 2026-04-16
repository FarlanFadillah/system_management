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
                "Alas Hak masih terikat dengan case yang sedang berlangsung",
                400,
            );
        }

        debug("creating case");
        const [id] = await trx(TABLE.CASES).insert({
            ...caseData,
            code: rand.genStringCaps(5, 5),
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

        const steps = workflows.map((val) => ({
            case_id: case_id,
            step_id: val.id,
            status: "DRAFT",
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
        return await trx(`${TABLE.$CASES.STEPS} as cs`)
            .leftJoin(`${TABLE.WORKFLOWS} as wf`, "wf.id", "cs.step_id")
            .where("cs.id", id)
            .select("cs.*")
            .select(
                trx.raw(
                    `JSON_OBJECT("name", wf.name, "required", wf.required_fields) as workflow`,
                ),
            )
            .first();
    } catch (error) {
        throw new ExpressError(error.message);
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
 * @param {Object} data
 * @param {import("knex").Knex.Transaction} trx
 */
export async function updateCase(id, data, trx) {
    try {
        await trx(TABLE.CASES).where({ id: id }).forUpdate().select("*");
        await trx(TABLE.CASES).where({ id: id }).update(data);
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function nextStep(id, data) {
    try {
        await db.transaction(async (trx) => {
            // TODO
            /**
             * 1. Get the case
             * 2. Get current step
             * 3. Check required field
             * 4. Update necessary data
             * 5. Update current step to the next if exists
             *
             */
            const _case = await trx(TABLE.CASES).where({ id: id }).first();
            await trx(TABLE.CASES).where({ id: id }).forUpdate().first(); // lock for update
            if (!_case) throw new ExpressError("Case does not exist", 404);
            else if (_case.status === "DONE")
                throw new ExpressError("Case already finished");

            const current_step = await trx(`${TABLE.$CASES.STEPS} as cs`)
                .leftJoin(`${TABLE.WORKFLOWS} as wf`, "wf.id", "cs.step_id")
                .where("cs.id", "=", _case.current_step)
                .select("wf.required_fields", "wf.name", "cs.step_id")
                .first();
            if (current_step.required_fields) {
                const { required_fields, name } = current_step;
                const _data = {};
                for (const value of Object.keys(required_fields)) {
                    if (!!data[value]) _data[value] = data[value];
                    else
                        throw new ExpressError(
                            `Required fields are missing. '${value}'`,
                        );
                }

                if (name.includes("BPHTB")) {
                    await trx(TABLE.BPHTB).where({ case_id: id }).update(_data);
                }

                // Set the current step status as 'DONE'
                await trx(TABLE.$CASES.STEPS)
                    .where({ case_id: id })
                    .update({ status: "DONE" });
            }

            const next_step = await trx(`${TABLE.$CASES.STEPS} as cs`)
                .leftJoin(`${TABLE.WORKFLOWS} as wf`, "wf.id", "cs.step_id")
                .where("cs.case_id", id)
                .andWhere("cs.step_id", ">", current_step.step_id)
                .select([
                    "cs.id",
                    "cs.step_id",
                    "wf.required_fields",
                    "wf.name",
                ])
                .first();

            if (next_step) {
                await trx(TABLE.CASES)
                    .where({ id: id })
                    .update({ current_step: next_step.id });

                await trx(TABLE.$CASES.STEPS)
                    .where({ id: next_step.id })
                    .update({ status: "IN PROGRESS" });
            } else {
                await trx(TABLE.CASES).where({ id: id }).update({
                    status: "DONE",
                    completed_at: trx.fn.now(),
                });
            }
        });
    } catch (error) {
        throw error;
    }
}

export async function updateCurrentCaseWorkflow(id, status) {
    try {
        await db.transaction(async (trx) => {
            // TODO
            /**
             * 1. Update status, and check current step.
             * 2. Update current step if the status is DONE
             * 3. Set the current step to IN PROGRESS
             */
            debug("Get case and lock for update");
            const data = await trx(TABLE.CASES)
                .where({ id: id })
                .forUpdate()
                .first();

            debug("Get current step case");
            const current_step = await trx(`${TABLE.$CASES.STEPS} as cs`)
                .leftJoin(`${TABLE.WORKFLOWS} as w`, "w.id", "cs.step_id")
                .select(["cs.*", "w.name"])
                .where({
                    "cs.id": data.current_step,
                    "cs.case_id": data.id,
                })
                .first();

            if (!current_step) throw new ExpressError("Step not found");
            if (current_step.status === "DONE")
                throw new ExpressError("Step already completed");

            if (status === "DONE") {
                debug("Current Step completed");
                await trx(TABLE.$CASES.STEPS)
                    .update({ status: status, completed_at: trx.fn.now() })
                    .where({ id: data.current_step, case_id: id });
                await log(trx, data.id, `${current_step.name} : COMPLETED`);
            } else {
                debug("Current Step updated");
                await trx(TABLE.$CASES.STEPS)
                    .update({ status: status })
                    .where({ id: data.current_step, case_id: id });

                await log(trx, data.id, `${current_step.name} : [${status}]`);
            }

            if (status === "DONE") {
                debug("Get next step to check if it exists");
                const next_step = await trx(`${TABLE.$CASES.STEPS} as cs`)
                    .leftJoin(`${TABLE.WORKFLOWS} as w`, "w.id", "cs.step_id")
                    .where("step_id", ">", current_step.step_id)
                    .andWhere({ case_id: data.id })
                    .select(["cs.*", "w.name"])
                    .orderBy("cs.step_id", "asc")
                    .first();

                if (next_step) {
                    debug("Move to the next step");
                    await trx(TABLE.CASES)
                        .where({ id: id })
                        .update({ current_step: next_step.id });

                    debug("Update current step status");
                    await trx(TABLE.CASES)
                        .where({ id: next_step.id, case_id: data.id })
                        .update({ status: "IN PROGRESS" });

                    await log(
                        trx,
                        data.id,
                        `${next_step.name} : [IN PROGRESS]`,
                    );
                } else {
                    debug("Case completed");
                    await trx(TABLE.CASES)
                        .where({ id: id })
                        .update({ status: "DONE" });
                    await log(trx, data.id, `Case Completed`);
                }
            }
        });
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

export async function getById(id) {
    try {
        const [[data]] = await db.raw(`
            SELECT c.id, c.code, c.status, c.completed_at,
                DATE_FORMAT(c.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
                DATE_FORMAT(c.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
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
                "required_fields", wf.required_fields
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
