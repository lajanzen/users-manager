import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

const users = [
  {
    name: 'Leon',
    username: 'Leon1',
    password: 'bla',
  },
  {
    name: 'Philipp',
    username: 'Philipp1',
    password: 'bla',
  },
  {
    name: 'Marwin',
    username: 'Marwin1',
    password: 'bla',
  },
  {
    name: 'Lara',
    username: 'Lara1',
    password: 'bla',
  },
];

app.post('/api/users', (req, res) => {
  const newUser = req.body;
  const user = users.find((user) => user.username === req.body.username);

  if (!newUser.name || !newUser.username || !newUser.password) {
    res.status(400).send('Missing information');
    return;
  }

  if (!user) {
    users.push(newUser);
    res.send(users);
  } else {
    res.status(409).send('User already exists');
  }
});

app.delete('/api/users/:username', (req, res) => {
  const userIndex = users.findIndex(
    (user) => user.username === req.params.username
  );
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.send(users);
  } else {
    res.status(404).send('Name is unknown');
  }
});

app.get('/api/users/:username', (req, res) => {
  const user = users.find((user) => user.username === req.params.username);
  if (user) {
    res.send(user);
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
