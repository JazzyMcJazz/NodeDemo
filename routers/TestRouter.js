import express from "express";
import passport from "passport";

const router = express.Router();

const options = {session: false, failureRedirect: '/unauthorized'}

router.get('/', passport.authenticate('jwt', options), (req, res) => {
    res.send('Test Authentication Successful')
})

router.get('/unauthorized', (req, res) => {
    res.send('Login to see this content')
})

export default router;