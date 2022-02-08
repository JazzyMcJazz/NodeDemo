const movieController = require('./movie-controller.js');
const express = require('express');

const app = express();
app.use(express.json());

movieController.launch(app);

app.listen(8080);

// Not knowing what the convensions are in Node
// I modeled this like I would do it in a Spring
// Boot project.
// Could probably have written some more robust
// logic to handle bad inputs.
