import helmet from "helmet";
import cookieParser from 'cookie-parser';
import path from 'path';
import bodyParser from "body-parser";
import passport from "passport";
import {authLimiter} from "./security/AuthConfig.js";
import AuthRouter from "./routers/AuthRouter.js";
import CourseRouter from './routers/CourseRouter.js';
import CategoryRouter from './routers/CategoryRouter.js';
import express from 'express';
import testRouter from "./routers/TestRouter.js";

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api', helmet()); // restrict headers to /api endpoints
// app.use('/api/auth', authLimiter); // limit requests to 6 per 15 minutes
app.use('/api/auth', AuthRouter);
app.use('/api/courses', CourseRouter);
app.use('/api/categories', CategoryRouter);
app.use('/api/auth', AuthRouter);

app.use(express.static(path.resolve('../client/public')));
app.get('*', (req, res) => res.sendFile(path.resolve('../client/public/index.html')))

app.use(testRouter)
// if you change default port it must also be changed in ./router/AuthRouter.js:37:75
const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
    if (err) console.log(err);
    else console.log("SERVER~: Server running on port", PORT)
});