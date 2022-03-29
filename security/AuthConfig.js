import passport from 'passport';
import passportJwt from 'passport-jwt';
const JwtStrategy = passportJwt.Strategy;

export const secret = {secretOrKey: 'super_duper_secret'}

const opts = {};
opts.secretOrKey = secret.secretOrKey;
opts.jwtFromRequest = req => {
    let token = null;
    if (req && req.cookies)
        token = req.cookies['jwt']

    return token;
}

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log(jwt_payload)
    if (await credentialsMatch(jwt_payload.data))
        return done(null, jwt_payload.data)
    else
        return done(null, false);
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


import rateLimit from "express-rate-limit";
import {credentialsMatch} from "./UserRepository.js";
import jwt from "jsonwebtoken";
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 6, // maximum attempts per 15 minutes
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
