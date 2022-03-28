import UserData from '/security/UserRepository.js';

import express from 'express';
const app = express();

import helmet from "helmet";
app.use(helmet());

import securityRouter from "./routers/SecurityRouter.js";
app.use(securityRouter);

const PORT = process.env.PORT | 3000;
app.listen(PORT, err => {
    if (err) console.log(err);
    else console.log("Server running on port", PORT)
})