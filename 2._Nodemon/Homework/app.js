const express = require('express');
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

const PORT = process.env.PORT || 443;
app.listen(PORT, err => {
    if (err) throw err;
    console.log('%c Server Running on ', PORT, 'color: green')
});