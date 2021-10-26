import express from 'express';

const app = express();
const port = 3000;

const users = ['Leon', 'Philipp', 'Marwin', 'Lara'];

app.get('/api/users/:name', (req, res) => {
  res.send(req.params.name);
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
