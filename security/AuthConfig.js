import {checkCredentials, getUserByEmail} from "./UserRepository.js";
import jwt from "jsonwebtoken";
import passport from 'passport';
import passportJwt from 'passport-jwt';
import rateLimit from "express-rate-limit";
const JwtStrategy = passportJwt.Strategy;

const secret = {secretOrKey: 'super_duper_secret_2'}

const opts = {};
opts.secretOrKey = secret.secretOrKey;
opts.jwtFromRequest = req => {
    let token = null;
    if (req && req.cookies)
        token = req.cookies['jwt']
    return token;
}

// this solution is not ideal since it requires that the plaintext password was used to generate the token
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    if (await checkCredentials(jwt_payload.data)) {
        const user = getUserByEmail(jwt_payload.data.email); // user object without password
        return done(null, user);
    } else
        return done(null, false);
}));

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 6, // maximum attempts per 15 minutes
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

export {authLimiter, secret}
