import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

// $ curl http://localhost:3000/users
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();

  res.json(users);
});

// $ curl http://localhost:3000/feed
app.get('/feed', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });

  res.json(posts);
});

// $ curl http://localhost:3000/post/1
app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  res.json(post);
});

// $ curl -X POST -H "Content-Type: application/json" -d '{"name":"Bob", "email":"bob@prisma.io"}' http://localhost:3000/user
app.post('/user', async (req, res) => {
  const result = await prisma.user.create({
    data: { ...req.body },
  });

  res.json(result);
});

// $ curl -X POST -H "Content-Type: application/json" -d '{"title":"I am Bob", "authorEmail":"bob@prisma.io"}' http://localhost:3000/post
app.post('/post', async (req, res) => {
  const { title, content, authorEmail } = req.body;
  const result = await prisma.post.create({
    data: {
      title,
      content,
      published: false,
      author: { connect: { email: authorEmail } },
    },
  });

  res.json(result);
});

// $ curl -X PUT http://localhost:3000/post/publish/2
app.put('/post/publish/:id', async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: { published: true },
  });

  res.json(post);
});

// $ curl -X DELETE http://localhost:3000/post/1
app.delete('/post/:id', async (req, res) => {
  const { id } = req.params;

  const post = await prisma.post.delete({
    where: { id: Number(id) },
  });

  res.json(post);
});

app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000')
);
