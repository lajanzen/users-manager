import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDatabase, getUserCollection } from '../utils/database';

const app = express();
const port = 3000;

if (!process.env.MONGODB_URL) {
  throw new Error('No MongoDB dotenv variable');
}

// Middleware for parsing application/json
app.use(express.json());

// Middleware for parsing cookies
app.use(cookieParser());

app.post('/api/users', async (req, res) => {
  const newUser = req.body;
  const user = await getUserCollection().findOne({
    username: newUser.username,
  });

  if (!newUser.name || !newUser.username || !newUser.password) {
    res.status(400).send('Missing information');
    return;
  }
  if (!user) {
    await getUserCollection().insertOne(newUser);
    res.send('New user added to MongoDB');
  } else {
    res.status(409).send('User already exists');
  }
});

app.delete('/api/users/:username', async (req, res) => {
  const user = await getUserCollection().findOne({
    username: req.params.username,
  });
  if (user) {
    await getUserCollection().deleteOne(user);
    res.send(`${user.name} has been deleted`);
  } else {
    res.status(404).send('Name is unknown');
  }
});

app.get('/api/users/:username', async (req, res) => {
  const user = await getUserCollection().findOne({
    username: req.params.username,
  });
  if (user) {
    res.send(user);
  } else {
    res.status(404).send('Name is unknown');
  }
});

app.get('/api/users', async (_req, res) => {
  const allUsers = await getUserCollection().find().toArray();
  res.send(allUsers);
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.get('/api/me', async (req, res) => {
  const username = req.cookies.username;
  const foundUser = await getUserCollection().findOne({ username: username });

  if (foundUser) {
    res.send(foundUser);
  } else {
    res.status(404).send('User not found');
  }
});

app.post('/api/login', async (req, res) => {
  const loginUser = req.body;
  const user = await getUserCollection().findOne({
    username: loginUser.username,
  });

  if (user) {
    if (user.password === loginUser.password) {
      res.setHeader('Set-Cookie', `username=${user.username}`);
      res.send(`${user.username} is now logged in`);
    } else {
      res.status(401).send('Password is not correct');
    }
  } else {
    res.status(401).send(`Username ${loginUser.username} unknown`);
  }
});

connectDatabase(process.env.MONGODB_URL).then(() =>
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })
);
