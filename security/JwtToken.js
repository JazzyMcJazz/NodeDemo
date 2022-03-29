import jwt from "jsonwebtoken";
import {secret} from "./AuthConfig.js";

export function issueToken(user) {
    return jwt.sign({data: user.email}, secret.secretOrKey, {expiresIn: '2h'});
}