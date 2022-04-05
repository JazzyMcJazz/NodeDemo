import MovieRouter from "./routers/MovieRouter.js";
import 'dotenv/config';

import express from 'express';
const app = express();

app.use(express.json());

import path from 'path';
app.use(express.static(path.resolve('../client/public')))

app.use('/api', MovieRouter);

const PORT = process.env.PORT | 3000;
app.listen(PORT, err => {
    if (err) console.log(err);
    else console.log('Server running on port', PORT);
})