import Router from 'express';
const router = Router();

router.get('/drinkcoffee', (req, res) => {
    req.session.amount -= 10;
    res.send({message: `you have ${req.session.amount} units of coffee left`});
})

router.get('/fillcoffee', (req, res) => {
    req.session.amount = 100;
    console.log(req.session);
    res.send({message: 'you coffee is cold'});
})

export default router;