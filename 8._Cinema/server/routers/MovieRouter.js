import { db } from '../database/CreateConnection.js';

import { Router } from 'express';
const router = Router();

/*
    All routes in this file are prepended with /api
 */

router.get('/movies', async (req, res) => {
    const data = await db.all('SELECT * FROM movies');
    console.log(data);
    res.send({data: data});
})

router.post('/movies', async (req, res) => {
    if (req.body.title && req.body.year) {
        const {title, year} = req.body;
        const changes = await db.run(`INSERT INTO movies (title, year) VALUES (?, ?)`, [title, year])
        res.status(201).send({rowsAffect: changes})
    }
    else res.status(400).send();
})

export default router;