import express from "express";
import passport from "passport";
import {getAllUsers} from "../security/UserRepository.js";

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
    if (req.user.role !== 'admin')
        res.status(401).send('Unauthorized. Admin privileges required')
    else
        res.send(getAllUsers());
})

export default router;