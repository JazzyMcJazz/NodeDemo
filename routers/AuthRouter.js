import {checkCredentials, existsByEmail, save} from "../security/UserRepository.js";
import {issueToken} from "../security/JwtToken.js";
import jwt from 'jsonwebtoken';

import express from 'express';
const router = express.Router();

router.post('/login', async (req, res) => {
    if (await checkCredentials(req.body)) {
        let token = issueToken(req.body);
        res.cookie('jwt', token);
        res.send(`Log in success ${req.body.email}`);

    } else res.send('Invalid Login Credentials');
});

router.post('/signup', async (req, res) => {
    if (existsByEmail(req.body.email))
        res.status(302).send({message: 'Email already in use'});

    else {
        await save(req.body);
        const token = issueToken(req.body);
        res.cookie('jwt', token);
        res.send(`Successfully signed up with ${req.body.email}`);
    }
})

export default router;