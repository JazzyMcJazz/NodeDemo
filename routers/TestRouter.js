import express from "express";
import passport from "passport";

const router = express.Router();

const options = {session: false}
const authenticate = passport.authenticate('jwt', options)

router.get('/', authenticate, (req, res) => {
    res.send('Test Authentication Successful')
})

router.get('/unauthorized', (req, res) => {
    res.send('Unauthorized')
})


router.get('/users', authenticate, (req, res) => {
    console.log(req.user);
    res.send();
})

export default router;