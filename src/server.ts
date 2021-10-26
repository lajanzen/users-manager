import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

const users = ['Leon', 'Philipp', 'Marwin', 'Lara'];

app.post('/api/users', (req, res) => {
  res.send(req.body.name);
});

app.delete('/api/users/:name', (req, res) => {
  const userIndex = users.indexOf(req.params.name);
  if (userIndex !== 1) {
    users.splice(userIndex, 1);
    res.send(users);
  } else {
    res.status(404).send('Name is unknown');
  }
});

app.get('/api/users/:name', (req, res) => {
  const isNameKnown = users.includes(req.params.name);
  if (isNameKnown) {
    res.send(req.params.name);
  } else {
    res.status(404).send('Name is unknown');
  }
});

app.get('/api/users', (_req, res) => {
  res.send(users);
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
