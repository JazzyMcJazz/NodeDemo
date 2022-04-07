import express from "express";
import passport from "passport";
import {getAllUsers} from "../repository/UserRepo.js";

const router = express.Router();

const options = {session: false}
const authenticate = passport.authenticate('jwt', options)

router.get('/unauthorized', (req, res) => {
    res.send('Unauthorized')
})



export default router;