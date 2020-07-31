import * as express from 'express';
import { AgentController } from '../controller/agent-controller';

export class AgentRoutes {
  static init(router: express.Router) {
    this.initPolicies(router);

    const agentController = new AgentController();

    router
      .route('/agent')
      .get((req, res) => agentController.getAll(req, res))
      .post((req, res) => agentController.create(req, res));
  }

  /**
   * Initialize policy list
   * @param router: Express.Router object
   */
  static initPolicies(router: express.Router): void {}
}
