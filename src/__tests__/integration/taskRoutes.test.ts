import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import { app } from '../../index'; 

beforeAll(async () => {
  await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'task_manager', 
    entities: ['src/models/*.ts'],
    synchronize: true,
    dropSchema: false, 
  });
});

afterAll(async () => {
  const connection = getConnection();
  await connection.close();
});

describe('Task Routes', () => {
  it('Deve criar uma tarefa', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({ title: 'Testar API', description: 'Descrição de teste' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Testar API');
  });

  it('Deve listar todas as tarefas', async () => {
    const response = await request(app).get('/tasks');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('Deve atualizar uma tarefa', async () => {
    const createResponse = await request(app)
      .post('/tasks')
      .send({ title: 'Tarefa para atualizar' });

    const taskId = createResponse.body.id;

    const updateResponse = await request(app)
      .put(`/tasks/${taskId}`)
      .send({ title: 'Tarefa atualizada', completed: true });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.title).toBe('Tarefa atualizada');
    expect(updateResponse.body.completed).toBe(true);
  });

  it('Deve excluir uma tarefa', async () => {
    const createResponse = await request(app)
      .post('/tasks')
      .send({ title: 'Tarefa para deletar' });

    const taskId = createResponse.body.id;

    const deleteResponse = await request(app).delete(`/tasks/${taskId}`);
    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app).get(`/tasks/${taskId}`);
    expect(getResponse.status).toBe(404);
  });
});
