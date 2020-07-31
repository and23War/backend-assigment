import { app } from '@/server/server';
import * as request from 'supertest';
import { getConnection, createConnection } from 'typeorm';
import { Agent } from '@/server/api/agent/entity/agent-entity';
import { IssueStatus } from '@/server/api/issue/entity/issue-status-entity';

describe('Issue endpoint', () => {
  const dataAgent = { name: 'Example', email: 'example@mail.com' };

  beforeAll(async () => {
    await createConnection();
    const agent = Agent.create(dataAgent);
    await agent.save();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  it('POST /issue', async () => {
    const dataIssue = {
      nameUser: 'User Example',
      emailUser: 'userexample@email.com',
      description: 'Problema 1',
    };
    const result = await request(app).post('/api/issue').send(dataIssue);

    expect(result.status).toEqual(201);
    expect(result.body.data.issue.agent.id).toEqual(1);
    expect(result.body.data.issue.nameUser).toEqual(dataIssue.nameUser);
    expect(result.body.data.issue.emailUser).toEqual(dataIssue.emailUser);
    expect(result.body.data.issue.description).toEqual(dataIssue.description);
    expect(result.body.data.issue.agent.id).toEqual(1);
    expect(result.body.data.issue.agent.name).toEqual(dataAgent.name);
    expect(result.body.data.issue.agent.email).toEqual(dataAgent.email);
  });

  it('PUT /issue/:id/resolve', async () => {
    const result = await request(app).put('/api/issue/1/resolve').set('Authorization', dataAgent.email);

    expect(result.status).toEqual(200);
    expect(result.body.data.issue.status).toEqual(IssueStatus.RESOLVED);
  });
});
