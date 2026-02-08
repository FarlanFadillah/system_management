import bcrypt from "bcrypt";


export function hashing(password){
    return new Promise((resolve, reject)=>{
        bcrypt.hash(password, 10, (err, hash)=>{
            if(err) reject(err);
            else resolve(hash);
        })
    })
}

export function compareHash(password, hash){
    return new Promise((resolve, reject)=>{
        bcrypt.compare(password, hash, (err, same)=>{
            if(err) reject(err);
            else resolve(same);
        })
    })
}