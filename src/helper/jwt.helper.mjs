import * as jwt from "../utils/jwt.mjs";
import * as userRepo from "../modules/auth/auth.repository.mjs";
import { ExpressError } from "../utils/custom.error.mjs";

export async function verifyUser(token) {
    try {
        // console.log(jwt.decoded(token));
        const decoded = await jwt.verifyToken(token);
        const user = await userRepo.getUserByUsername(decoded.username);
        return { decoded, user };
    } catch (error) {
        throw new ExpressError(error.message, 401);
    }
}
