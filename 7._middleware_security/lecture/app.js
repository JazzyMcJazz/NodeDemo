import express from 'express';
import pass from './password.js';

const app = express();

app.use(express.static('/public'));

import helmet from 'helmet';
app.use(helmet());

import rateLimit from "express-rate-limit";
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 6, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

import session from 'express-session';
app.use(session({
    secret: 'keyboard cat', //should be changed, shouldnt be pushed',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

import coffeeRouter from "./routers/coffee.js";
app.use(coffeeRouter);

app.use('/auth', authLimiter);
app.get('/auth', (req, res) => {
    res.send({message: "You are trying to log in"});
})

// app.get('/computer', (req, res) => {
//     res.sendFile(__dirname + '/public/computer.html');
// })

function middleware(req, res, next) {
    console.log('blablabla');
    next();
}

app.get('/room', middleware, (req, res, next) => {
    res.send({message: "You are in room 1"});
});

const PORT = process.env.PORT | 5000;
app.listen(PORT, err => {
    if (err)
        console.log(err)
    else console.log('Server running on port', PORT);
});;