import jwt from "jsonwebtoken";

export function signUser(payload){
    return new Promise((resolve, reject)=>{
        jwt.sign(payload, process.env.JWT_SECRET_KEY, {algorithm : "HS256", expiresIn : "5h"}, (err, token)=>{
            if(err) reject(err);
            else resolve(token);
        })
    })
}

export function verifyToken(token){
    return new Promise((resolve, reject)=>{
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded)=>{
            if(err) reject(err);
            else resolve(decoded);
        })
    })
}