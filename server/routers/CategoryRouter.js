import {Router} from "express";
import {getAllCategories} from "../repository/CategoryRepo.js";

const router = Router();

// All endpoints are preceded by /api/categories

router.get('/', async (req, res) => {
    res.send(await getAllCategories());
});

export default router;