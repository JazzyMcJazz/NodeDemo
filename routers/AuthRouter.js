import {checkUser, secret} from "../security/AuthConfig.js";
import jwt from 'jsonwebtoken';

import express from 'express';
const router = express.Router();

router.post('/login', async (req, res) => {
    if (await checkUser(req.body)) {
        let token = jwt.sign({
            data: req.body
        }, secret.secretOrKey, {expiresIn: '1h'});
        res.cookie('jwt', token);
        res.send(`Log in success ${req.body.email}`);

    } else res.send('Invalid Login Credentials');
});

export default router;