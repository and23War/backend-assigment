/**
 * Entities
 */
import { Agent } from '../entity/agent-entity';
import { AgentStatus } from '../entity/agent-status-entity';

export class AgentBusinessLogic {
  constructor() {}

  async getBy(query: object = {}) {
    const agentList = await Agent.find(query);
    return agentList;
  }

  async getById(agentId: number) {
    const agent = await Agent.findOne(agentId);
    return agent;
  }

  async create(agentData: Agent) {
    return await agentData.save();
  }

  async update(agentData: Agent) {
    agentData.updatedAt = new Date();
    const agent = await agentData.save();
    return agent;
  }

  /**
   * Search `Agent` with status Available
   */
  async searchAvailable() {
    const agent = await Agent.findOne({ status: AgentStatus.AVAILABLE });
    return agent;
  }

  /**
   * Set property status of `Agent`
   * @param {Agent} agent
   * @param {AgentStatus} status
   */
  async setStatus(agent: Agent, status: AgentStatus) {
    agent.status = status;
    return await this.update(agent);
  }
}
