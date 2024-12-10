import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import taskRoutes from './routes/taskRoutes';
import { createConnection } from 'typeorm';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/tasks', taskRoutes);

// Conexão com o banco e inicialização do servidor
if (process.env.NODE_ENV !== 'test') {
  createConnection().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  });
}

export { app };
