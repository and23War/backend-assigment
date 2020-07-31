import { Router } from 'express';

/**
 * Routes
 */
import { AgentRoutes } from '../api/agent/route/agent-route';
import { IssueRoutes } from '../api/issue/route/issue-route';

export class Public {
  static init(): Router {
    const router = Router();
    AgentRoutes.init(router);
    IssueRoutes.init(router);
    return router;
  }
}
