import {getUserByEmail} from "../repository/UserRepo.js";
import jwt from "jsonwebtoken";
import passport from 'passport';
import passportJwt from 'passport-jwt';
import rateLimit from "express-rate-limit";
// import 'dotenv/config';

const JwtStrategy = passportJwt.Strategy;

const secret = {secretOrKey: process.env.JWT_SECRET || 'not_so_secret_:('}

const opts = {};
opts.secretOrKey = secret.secretOrKey;
opts.jwtFromRequest = req => {
    let token = null;
    if (req && req.cookies)
        token = req.cookies['jwt']
    return token;
}

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    const user = await getUserByEmail(jwt_payload.data.email);
    if (user)
        if (user.enabled)
            return done(null, user);

    return done(null, false);
}));

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 6, // maximum attempts per 15 minutes
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const authenticate = passport.authenticate('jwt', {session: false});

export {authLimiter, secret, authenticate}
