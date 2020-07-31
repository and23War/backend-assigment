import { Issue } from '../entity/issue-entity';
import { Like, getRepository } from 'typeorm';

/**
 * Entities
 */
import { IssueStatus } from '../entity/issue-status-entity';
import { Agent } from '../../agent/entity/agent-entity';
import { AgentStatus } from '../../agent/entity/agent-status-entity';

/**
 * Bl
 */
import { AgentBusinessLogic } from '../../agent/bl/agent-bl';

export class IssueBusinessLogic {
  private agentBusinessLogic: AgentBusinessLogic;

  constructor() {
    this.agentBusinessLogic = new AgentBusinessLogic();
  }

  /**
   * It is in charge of assigning an agent to a issue, you can pass as parameter criteria for the assignment
   * @param {Issue|undefined} issue
   * @param {Issue|undefined} agent
   */
  async assignAgent(issue: Issue | undefined = undefined, agent: Agent | undefined = undefined): Promise<undefined | Issue> {
    const targetIssue: Issue = issue || (await this.searchOpen());
    if (!targetIssue) return;

    let targetAgent = agent || (await this.agentBusinessLogic.searchAvailable());
    if (!targetAgent) return;
    targetAgent = await this.agentBusinessLogic.setStatus(targetAgent, AgentStatus.BUSY);
    targetIssue.agent = targetAgent;
    return await targetIssue.save();
  }

  async getBy(query: object = {}): Promise<Issue[]> {
    const issueList = await Issue.find(query);
    return issueList;
  }

  async getById(issueId: number): Promise<Issue> {
    const issue = await Issue.findOne(issueId);
    return issue;
  }

  async create(issueData: Issue): Promise<Issue> {
    const newIssue = await issueData.save();
    const agentIssue = await this.assignAgent(newIssue);
    if (!agentIssue) return newIssue;
    return agentIssue;
  }

  /**
   * Change the status of a issue to solved and see if there are more issues to be solved
   * @param issueData
   */
  async resolve(issueData: Issue): Promise<Issue> {
    issueData.updatedAt = new Date();
    issueData.status = IssueStatus.RESOLVED;
    const issue = await issueData.save();

    const agent = await this.agentBusinessLogic.getById(issue.agentId);

    // Search new issue to the agent
    const agentIssue = await this.assignAgent(undefined, agent);

    // Not issues open then set agent to Available
    if (!agentIssue) await this.agentBusinessLogic.setStatus(agent, AgentStatus.AVAILABLE);

    return issue;
  }

  /**
   * Look for the problems to be solved that do not have an assigned agent
   */
  async searchOpen() {
    const issue = await Issue.findOne({ status: IssueStatus.OPEN, agentId: null });
    return issue;
  }
}
