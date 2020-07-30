import { Router } from 'express';

/**
 * Routes
 */
import { AgentRoutes } from '../api/agent/route/agent-route';

export class Public {
  static init(): Router {
    const router = Router();
    AgentRoutes.init(router);
    return router;
  }
}
