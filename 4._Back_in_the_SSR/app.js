const express = require('express');

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
    if (err) throw err;
    else console.log('Server running on port', PORT);
});