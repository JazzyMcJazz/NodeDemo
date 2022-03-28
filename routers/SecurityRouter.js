import {checkUser, authLimiter} from "../security/Config.js";
import jwt from 'jsonwebtoken';
import express from 'express';
const app = express();
const router = express.Router();

const basepath = '/api/auth';

app.use(basepath + '/login', authLimiter)
router.post(basepath + '/login', (req, res) => {
    if (checkUser(req.body)) {
        let token = jwt.sign({
            data: req.body
        }, 'secret', {expiresIn: '1h'});
        res.cookie('jwt', token);
        res.send(`Log in success ${req.body.email}`);

    } else res.send('Invalid Login Credentials');
});

export default router;