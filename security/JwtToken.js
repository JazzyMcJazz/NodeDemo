import jwt from "jsonwebtoken";
import {secret} from "./AuthConfig.js";

// this solution is not idea since the plaintext password is used when generating the token
export function issueToken(user) {
    return jwt.sign({data: user}, secret.secretOrKey, {expiresIn: '7012800h'});
}