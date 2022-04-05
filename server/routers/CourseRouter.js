import {Router} from 'express';
import {
    getAllCourses,
    getCourseById,
    getCoursesByCategory_id,
    getMostPopularCourses,
    getNewCourses
} from "../repository/CourseRepo.js";
import passport from "passport";

const router = Router();

// All endpoint are preceded by /api/courses

// TODO: POST, UPDATE, PATCH, DELETE endpoints
// Currently no plans for the front-end application to use these

router.get('/', async (_, res) => {

    const data = await getAllCourses();

    // remove sensitive data for non-admins
    passport.authenticate('jwt', {session: false}, (_, user) => {
        if (!user && user.role !== 'admin') data.forEach(course => delete course.number_of_purchases);
    })(_, res);

    res.send({ data: data});
});

router.get('/most-popular', async (req, res) => {
    const amount = req.query.amount || 3;
    const data = await getMostPopularCourses(amount);

    // remove sensitive data for non-admins
    passport.authenticate('jwt', {session: false}, (_, user) => {
        if (!user && user.role !== 'admin') data.forEach(course => delete course.number_of_purchases);
    })(req, res);

    res.send({data: data});
});

router.get('/new', async (req, res) => {
    const amount = req.query.amount || 3;
    const data = await getNewCourses(amount);

    // remove sensitive data for non-admins
    passport.authenticate('jwt', {session: false}, (_, user) => {
        if (!user && user.role !== 'admin') data.forEach(course => delete course.number_of_purchases);
    })(req, res);

    res.send({data: data});
});

router.get('/id/:id', async (req, res) => {
    const id = req.params.id;

    const data = await getCourseById(id);

    if (!data) {
        res.status(404).send({message: `No course found with that id`});
        return;
    }

    // remove sensitive data for non-admins
    passport.authenticate('jwt', {session: false}, (_, user) => {
        if (!user && user.role !== 'admin') delete data.number_of_purchases;
    })(req, res);

    res.send({data: data});

})

router.get('/category/:id', async (req, res) => {
    const id = req.params.id;

    const data = await getCoursesByCategory_id(id);

    if (data.length < 1) {
        res.status(404).send({message: `No course found with that category id`});
        return;
    }

    // remove sensitive data for non-admins
    passport.authenticate('jwt', {session: false}, (_, user) => {
        if (!user && user.role !== 'admin') data.forEach(course => delete course.number_of_purchases);
    })(req, res);

    res.send({data: data});

})

export default router;