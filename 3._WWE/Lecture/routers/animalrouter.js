const router = require('express').Router();

router.get('/amount', (req, res) => {
   res.send({data: "test 28"})
});

router.get('/blabla', (req, res) => {
   res.redirect('/amount');
})

module.exports = router;