import { Agent } from '../entity/agent-entity';

export class AgentBusinessLogic {
  constructor() {}

  async getBy(query: object = {}): Promise<Agent[]> {
    const agentList = await Agent.find(query);
    return agentList;
  }

  async getById(agentId: number): Promise<Agent> {
    const agent = await Agent.findOne(agentId);
    return agent;
  }

  async create(agentData: Agent): Promise<Agent> {
    const newAgent = await agentData.save();
    // assign issue
    return newAgent;
  }
}
