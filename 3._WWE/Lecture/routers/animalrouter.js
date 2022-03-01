const router = require('express').Router();

router.get('/amount', (req, res) => {
   res.send({data: "test 28"})
});

module.exports = router;