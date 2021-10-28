import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDatabase } from '../utils/database';

const app = express();
const port = 3000;

if (!process.env.MONGODB_URL) {
  throw new Error('No MongoDB dotenv variable');
}

// Middleware for parsing application/json
app.use(express.json());

// Middleware for parsing cookies
app.use(cookieParser());

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

app.get('/api/me', (req, res) => {
  const username = req.cookies.username;
  const foundUser = users.find((user) => user.username === username);

  if (foundUser) {
    res.send(foundUser);
  } else {
    res.status(404).send('User not found');
  }
});

app.post('/api/login', (req, res) => {
  const user = users.find(
    (user) =>
      user.username === req.body.username && user.password === req.body.password
  );

  if (user) {
    res.setHeader('Set-Cookie', `username=${user.username}`);
    res.send(`${user.username} is now logged in`);
  } else {
    res.status(401).send('Something went wrong');
  }
});

connectDatabase(process.env.MONGODB_URL).then(() =>
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })
);
