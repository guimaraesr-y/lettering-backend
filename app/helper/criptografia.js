import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export function encrypt(text) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(text, salt);
}

export function compare(text, hash) {
    return bcrypt.compareSync(text, hash);
}

export function generateJWT(data) {
    return jwt.sign(data, process.env.SECRET, {
        // expiresIn: 300 // expires in 5min
    });
}