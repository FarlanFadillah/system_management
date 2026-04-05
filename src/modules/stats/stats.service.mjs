import * as statsRepo from "./stats.repository.mjs";
export async function getStats() {
    try {
        return await statsRepo.getStats();
    } catch (error) {
        throw error;
    }
}
