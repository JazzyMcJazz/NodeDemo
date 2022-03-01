const express = require('express');
const router = require('./router/ssr-router');

const app = express();

app.use(express.static('public'));

app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
    if (err) throw err;
    else console.log('Server started on port', PORT);
});