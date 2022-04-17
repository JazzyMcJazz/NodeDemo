import express from "express";
import {getAllUsers} from "../repository/UserRepo.js";
import {authenticate} from "../security/AuthConfig.js";
import {getUserCourses} from "../repository/UserCourseRepo.js";

const router = express.Router();

// All endpoints are preceded by /api/users

router.get('/', authenticate, async (req, res) => {
    const user = req.user;
    if (user.role === 'admin')
        if (user.verified) {
            const users = await getAllUsers();

            // populate user objects with their purchased courses
            for (let i in users)
                users[i].courses = await getUserCourses(users[i]);

            res.send({data: users});

        } else res.status(401).send({message: 'You must verify your account to access this information'})
    else
        res.status(401).send({message: 'Unauthorized. Admin privileges required'})
});

router.get('/self', authenticate, async (req, res) => {
    req.user.courses = await getUserCourses(req.user);
    res.send({data: req.user});
});

export default router;