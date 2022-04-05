import jwt from "jsonwebtoken";
import {secret} from "./AuthConfig.js";

export function issueToken(user) {
    return jwt.sign(
        {data: {email: user.email}},
        secret.secretOrKey,
        {expiresIn: '168h'} // one week
    );
}