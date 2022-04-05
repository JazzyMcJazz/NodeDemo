import {Router} from 'express';
import {checkUserCredentialsAndReturnUser, userExistsByEmail, saveNewUser, updateUser} from "../repository/UserRepo.js";
import {issueToken} from "../security/JwtToken.js";
import jwt from 'jsonwebtoken';
import * as crypto from "crypto";
import {
    checkVerificationToken,
    removeVerificationTokenByUser_id,
    saveNewVerificationToken
} from "../repository/VerificationTokenRepo.js";
import {sendMail} from "../utils/Mailer.js";

const router = Router();

// All endpoint are preceded by /api/auth

router.post('/login', async (req, res) => {
    if (await checkUserCredentialsAndReturnUser(req.body)) {
        let token = issueToken(req.body);
        res.cookie('jwt', token);
        console.log(`[${new Date().toLocaleString()}] AUTH: ${req.body.email} logged in`)
        return res.send({message: `${req.body.email} successfully logged in`
    });
    }

    console.log(`[${new Date().toLocaleString()}] AUTH: Login attempt unauthorized`)
    res.status(401).send({message: 'Email or password is incorrect'});
});

router.post('/signup', async (req, res) => {
    const user = req.body;
    if (!user.email || !user.password) return res.status(400).send({message: 'Bad request'});
    if (await userExistsByEmail(req.body.email))
        return res.status(302).send({message: 'Email already in use'});

    // save token for account verification
    const user_id = await saveNewUser(req.body);
    const verificationToken = crypto.randomBytes(16).toString('hex');
    await saveNewVerificationToken(user_id, verificationToken);

    // send account verification email
    const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const link = `${BASE_URL}/api/auth/verify/${user_id}/${verificationToken}`;
    const html = `<p>Click link to verify your account</p><a href="${link}" target="_blank">${link}</a>`
    await sendMail(req.body.email, 'Verify Account', html);

    const jwtToken = issueToken(req.body);
    res.cookie('jwt', jwtToken);
    res.send({message: `Successfully signed. A verification link has been sent to ${req.body.email}`});
});

router.get('/verify/:id/:token', async (req, res) => {
    const user_id = req.params.id;
    const token = req.params.token;

    const isMatch = await checkVerificationToken(user_id, token);
    if (!isMatch) return res.status(400).send({message: 'Invalid link'});

    // TODO: safeguard against errors
    await updateUser({id: user_id, verified: 1});
    await removeVerificationTokenByUser_id(user_id);

    console.log(`[${new Date().toLocaleString()}] AUTH: User verified their email`)
    res.send({message: 'Account Verification Successful'});
});

export default router;