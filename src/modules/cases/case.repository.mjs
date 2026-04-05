import db from "../../dbs/db.mjs";
import { ExpressError } from "../../utils/custom.error.mjs";
import createDebug from "debug";
import { toISO } from "../../utils/date.mjs";

const debug = new createDebug("app:repo:cases");

// {
//   "case_num" : "001/PPAT-WK/III/2026",
//   "case_date" : "2026-03-01",
//   "status" : "DRAFT",
//   "prd_id" : 1,
//   "ah_id" : 3
// }

export async function createCase(model) {
    try {
        // debug("Model : ", JSON.stringify(model));
        const { clients, ...caseData } = model;
        let result;
        await db.transaction(async (trx) => {
            debug("Check case conflicts");
            const conflict = await trx("cases")
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
            const [id] = await trx("cases").insert(caseData);

            debug("Get Workflows");
            const workflows = await trx("workflows").where({
                prd_id: caseData.prd_id,
            });

            const steps = workflows.map((val) => ({
                case_id: id,
                step_id: val.id,
                status: "DRAFT",
            }));

            if (steps.length <= 0)
                throw new ExpressError(
                    "Workflows for this product does not exists",
                );

            debug("Initiate steps");
            const [insertedID] = await trx("case_steps").insert(steps);

            debug("Updating current step case");
            if (insertedID > 0)
                await trx("cases")
                    .update({ current_step: insertedID })
                    .where({ id: id });

            if (!clients) throw new ExpressError("Clients is empty", 400);
            debug("create client case");
            const case_clients = clients.map((val) => ({
                case_id: id,
                client_id: val.id,
                roles_id: val.roles_id,
            }));
            await trx("case_clients").insert(case_clients);

            debug("Log activity");
            await trx("activity_logs").insert({
                case_id: id,
                action: "Case created",
            });
            result = id;
        });
        return result;
    } catch (error) {
        throw new ExpressError(
            error.message,
            error.http_status || 400,
            error.code || "something broke",
        );
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
            const data = await trx("cases")
                .where({ id: id })
                .forUpdate()
                .first();

            debug("Get current step case");
            const current_step = await trx("case_steps")
                .leftJoin("workflows as w", "w.id", "case_steps.step_id")
                .select(["case_steps.*", "w.name"])
                .where({
                    "case_steps.id": data.current_step,
                    "case_steps.case_id": data.id,
                })
                .first();

            if (!current_step) throw new ExpressError("Step not found");
            if (current_step.status === "DONE")
                throw new ExpressError("Step already completed");

            if (status === "DONE") {
                debug("Current Step completed");
                await trx("case_steps")
                    .update({ status: status, completed_at: trx.fn.now() })
                    .where({ id: data.current_step, case_id: id });
                await log(trx, data.id, `${current_step.name} : COMPLETED`);
            } else {
                debug("Current Step updated");
                await trx("case_steps")
                    .update({ status: status })
                    .where({ id: data.current_step, case_id: id });

                await log(trx, data.id, `${current_step.name} : [${status}]`);
            }

            if (status === "DONE") {
                debug("Get next step to check if it exists");
                const next_step = await trx("case_steps")
                    .leftJoin("workflows as w", "w.id", "case_steps.step_id")
                    .where("step_id", ">", current_step.step_id)
                    .andWhere({ case_id: data.id })
                    .select(["case_steps.*", "w.name"])
                    .orderBy("step_id", "asc")
                    .first();

                if (next_step) {
                    debug("Move to the next step");
                    await trx("cases")
                        .where({ id: id })
                        .update({ current_step: next_step.id });

                    debug("Update current step status");
                    await trx("case_steps")
                        .where({ id: next_step.id, case_id: data.id })
                        .update({ status: "IN PROGRESS" });

                    await log(
                        trx,
                        data.id,
                        `${next_step.name} : [IN PROGRESS]`,
                    );
                } else {
                    debug("Case completed");
                    await trx("cases")
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
        await trx("activity_logs").insert({
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
            SELECT cases.id, cases.case_num, cases.case_date, cases.status,
                DATE_FORMAT(cases.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
                DATE_FORMAT(cases.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
            (SELECT JSON_OBJECT("id", ah.id, "no_alas_hak", ah.no_alas_hak) 
                FROM alas_hak AS ah WHERE ah.id = cases.ah_id
            ) AS alas_hak,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT("id", c.id, "first_name", c.first_name, "last_name", c.last_name, "role", cr.name))
                FROM case_clients as cc LEFT JOIN clients AS c on c.id = cc.client_id 
                LEFT JOIN client_roles as cr on cr.id = cc.roles_id
                WHERE cc.case_id = 1
            ) AS clients,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT("id", cs.id, "status", cs.status, "name", wf.name, "is_active",
                CASE
                    WHEN cs.id = cases.current_step THEN 1
                    ELSE 0
                END
            )) FROM case_steps as cs
                LEFT JOIN workflows AS wf on wf.id = cs.step_id
                WHERE cs.case_id = cases.id
            ) as case_steps,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT("action", al.action, "level", al.level, "timestamp", al.timestamp)) 
            FROM activity_logs as al
            WHERE al.case_id = cases.id
            ) as activities
            FROM cases WHERE cases.id = ${id} LIMIT 1;
        `);

        // {
        //     ...data,
        //     created_at: toISO(data.created_at),
        //     updated_at: toISO(data.updated_at),
        //     activities: data.activities.map((val) => ({
        //         level: val.level,
        //         action: val.action,
        //         timestamp: toISO(val.timestamp),
        //     })),
        // }

        // console.log(typeof data.updated_at);
        // console.log(data.updated_at);
        // console.log(typeof data.activities[0].timestamp);
        // console.log(data.activities[0].timestamp);
        return data;
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function getBy(key, value) {
    try {
        return await db("cases")
            .leftJoin("case_clients as pc", "pc.case_id", "cases.id")
            .leftJoin("clients as cl", "cl.id", "pc.client_id")
            .leftJoin("client_roles as cr", "cr.id", "pc.roles_id")
            .leftJoin("alas_hak as ah", "ah.id", "cases.ah_id")
            .leftJoin("products", "products.id", "cases.prd_id")
            .leftJoin("case_steps as cs", "cs.id", "cases.current_step")
            .leftJoin("workflows as wf", "wf.id", "cs.step_id")
            .select([
                "cases.*",
                "products.name as products",
                "ah.no_alas_hak",
                "ah.luas",
                "cl.id as client_id",
                "cl.first_name",
                "cl.last_name",
                "cr.name as roles_name",
                "cs.status as step_status",
                "wf.name as step_name",
            ])
            .where(`cases.${key}`, value);
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
        const data = await db("cases")
            .leftJoin("products", "products.id", "cases.products_id")
            .where(`cases.${key}`, "like", `%${value}%`)
            .select([
                "cases.id",
                "cases.case_num",
                "cases.case_date",
                "products.name as products",
            ])
            .limit(limit)
            .offset(offset);

        const [{ count }] = await db("cases")
            .where(key, "like", `%${value}%`)
            .count("* as count");

        return { data, count };
    } catch (error) {
        throw new ExpressError(error.message);
    }
}

export async function getAll(limit, offset) {
    try {
        const data = await db("cases")
            .leftJoin("products", "products.id", "cases.prd_id")
            .select([
                "cases.id",
                "cases.case_num",
                "cases.case_date",
                "products.name as products",
            ])
            .limit(limit)
            .offset(offset);
        const [{ count }] = await db("cases").count("id as count");
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
 * @param {String} number
 * @returns
 */
export async function searchByDate(limit, offset, from, to, number) {
    try {
        const data = await db("cases")
            .whereBetween("case_date", [from, to])
            .modify(function (queryBuiler) {
                if (number) {
                    queryBuiler.andWhere("case_num", "like", `${number}%`);
                }
            })
            .select(["id", "case_num", "case_date"])
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
