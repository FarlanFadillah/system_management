import { getClientIdsFromCase } from "./case.repository.mjs";
import { getCaseData } from "./case.service.mjs";

export * as router from "./case.router.mjs";
export const caseService = {
    getCaseData,
};
export const caseRepo = {
    getClientIdsFromCase,
};
