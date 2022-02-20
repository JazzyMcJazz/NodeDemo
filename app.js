const express = require('express');
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

const port = 443;
app.listen(port, () => console.log('Server Running on ', port));