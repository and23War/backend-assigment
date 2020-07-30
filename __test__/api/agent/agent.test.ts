import { app } from '@/server/server';
import * as request from 'supertest';
import { getConnection, createConnection } from 'typeorm';

describe('Agent ndpoint', () => {
  beforeAll(async () => {
    await createConnection();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  it('POST /agent', async () => {
    const dataAgent = { name: 'Example', email: 'example@mail.com' };
    const result = await request(app).post('/api/agent').send(dataAgent);

    expect(result.status).toEqual(201);
    expect(result.body.data.agent.id).toEqual(1);
    expect(result.body.data.agent.name).toEqual(dataAgent.name);
    expect(result.body.data.agent.email).toEqual(dataAgent.email);
  });
});
