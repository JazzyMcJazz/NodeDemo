const movieController = require('./movie-controller.js');
const express = require('express');

const app = express();
app.use(express.json());

movieController.launch(app);

app.listen(8080);
