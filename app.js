const express = require('express');
const controller = require('./controller/ssr-controller');

const app = express();

app.use(express.static('public'));

controller.publish(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
    if (err) throw err;
    else console.log('Server started on port', PORT);
})