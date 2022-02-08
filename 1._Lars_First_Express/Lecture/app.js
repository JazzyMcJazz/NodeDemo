const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'Hello World!' });
});

app.post('/', (req, res) => {
  res.send(req.body);
});

// task: about endpoint
// tak: POST /opinion with response that contains an opinion about the request data

app.get('/about', (req, res) => {
  res.send(`This server is Jazzy's first Node.js server with Express`);
});

app.post('/opinion', (req, res) => {
  let opinion;
  if (req.body.message == 'nice weather') opinion = 'really?';
  else opinion = `you are so fucking dumb`;
  res.send({ opinion: opinion });
});

app.listen(8008);
