import express from 'express';
const app = express();

const secret = {secretOrKey: 'super_duper_secret'}

import bodyParser from "body-parser";
app.use(bodyParser.urlencoded({extended: false}));

import cookieParser from 'cookie-parser';
app.use(cookieParser());

import passport from 'passport';
app.use(passport.initialize());

import rateLimit from "express-rate-limit";
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 6, // maximum attempts per 15 minutes
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const opts = {};
opts.jwtFromRequest = req => {
    let token = null;
    if (req && req.cookies)
        token = req.cookies['jwt']
    return token;
}

opts.secretOrKey = secret.secretOrKey;

import passJwt from 'passport-jwt';
const JwtStrategy = passJwt.Strategy;

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log('JWT BASED AUTH GETTING CALLED');
    if (checkUser(jwt_payload.data))
        return done(null, jwt_payload.data)
    else
        return done(null, false);
}));

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((obj, done) => {
    done(null, obj)
})

import {UserData} from "./UserRepository.js";
function findOrCreate(user) {
    if (checkUser(user))
        return user;
    else
        UserData.push(user);
}

export function checkUser(user) {
    for (let i in UserData)
        if (user.email === UserData[i].email && user.password === UserData[i].password || UserData[i].provider === user.provider)
            return true;
    return false;
}
