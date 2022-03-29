import helmet from "helmet";
import cookieParser from 'cookie-parser';
import path from 'path';
import bodyParser from "body-parser";
import passport from "passport";
import authRouter from "./routers/AuthRouter.js";
import testRouter from './routers/TestRouter.js';
import {authLimiter} from "./security/AuthConfig.js";

import express from 'express';
const app = express();

app.use(express.static(path.resolve('../client/public')))
app.use(express.json())
app.use(helmet());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(passport.initialize());
app.use('/api/auth', authLimiter)
app.use('/api/auth', authRouter);

app.use(testRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
    if (err) console.log(err);
    else console.log("Server running on port", PORT)
})