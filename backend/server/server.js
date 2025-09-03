import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { Sequelize } from 'sequelize';

import TodoModel from '../db/models/todo.js';

const app = express();
dotenv.config();

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json());

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
      logging: false,
    })
  : new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT || 'postgres',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      logging: false,
    });

const Todo = TodoModel(sequelize, Sequelize.DataTypes);

sequelize
  .authenticate()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Unable to connect to PostgreSQL:', err));
sequelize
  .sync({ force: false })
  .then(() => console.log('Database synchronized'))
  .catch((err) => console.error('Error during synchronization:', err));

app.get('/todos', async (req, res) => {
  try {
    const todos = await sequelize.query('SELECT * FROM "Todos"', {
      type: Sequelize.QueryTypes.SELECT,
    });
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Ошибка получения Todos' });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const { description, completed } = req.body;
    if (!description) {
      return res.status(400).json({ error: 'ОПИСАНИЕ ОБЯЗАТЕЛЬНО' });
    }
    const newDescription = await Todo.create({
      description,
      completed: completed ?? false,
    });
    res.status(201).json(newDescription);
  } catch (error) {
    console.error('Ошибка добавления заметки', error.message);
    res.status(500).json({ error: 'Ошибка при сохранении' });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ where: { id } });
    if (!todo) {
      return res.status(404).json({ message: 'Заметка не найдена' });
    }
    await todo.destroy();
    return res.json({ id, message: 'Заметка удалена успешно' });
  } catch (error) {
    console.error('Ошибка удаления заметки:', error);
    res.status(500).json({ message: 'Ошибка сервера при удалении' });
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ where: { id } });
    if (!todo) {
      return res.status(404).json({ message: 'Заметка не найдена' });
    }
    todo.completed = !todo.completed;
    await todo.save();
    return res.json(todo);
  } catch (error) {
    console.error('Ошибка сервера при изменении статуса:', error);
    res.status(500).json({ message: 'Ошибка сервера при изменении статуса' });
  }
});

app.patch('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const todo = await Todo.findOne({ where: { id } });
    if (!todo) {
      return res.status(404).json({ message: 'Заметка не найдена' });
    }
    todo.description = description;
    await todo.save();
    return res.json(todo);
  } catch (error) {
    console.error('Ошибка сервера при изменении описания:', error);
    res.status(500).json({ message: 'Ошибка сервера при изменении описания' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
