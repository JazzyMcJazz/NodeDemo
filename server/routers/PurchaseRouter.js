import express from "express";
import {authenticate} from "../security/AuthConfig.js";
import {addCoursesToUser} from "../repository/UserCourseRepo.js";

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
    if (req.body.paymentInfo) {
        // fake validation

        // TODO: validate req.body.courses

        await addCoursesToUser(req.body.courses, req.user);
        res.status(200).send();

    } else res.status(400).send();
});

export default router;