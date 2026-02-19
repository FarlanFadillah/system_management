import jwt from "jsonwebtoken";
import { ExpressError } from "./custom.error.mjs";

export function signUser(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.JWT_KEY,
            { algorithm: "HS256", expiresIn: "5h" },
            (err, token) => {
                if (err) reject(new ExpressError(err.message));
                else resolve(token);
            },
        );
    });
}

export function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) reject(new ExpressError(err.message));
            else resolve(decoded);
        });
    });
}
