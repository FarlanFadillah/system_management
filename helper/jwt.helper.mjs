import * as jwt from "../utils/jwt.mjs";
import * as userRepo from "../src/auth/auth.repository.mjs";
import { ExpressError } from "../utils/custom.error.mjs";

export async function verifyUser(token) {
    try {
        const decoded = await jwt.verifyToken(token);
        const user = await userRepo.getUserByUsername(decoded.username);
        return { decoded, user };
    } catch (error) {
        throw new ExpressError(error.message, 401);
    }
}
