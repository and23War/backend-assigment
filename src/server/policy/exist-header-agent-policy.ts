import { Request, Response, NextFunction } from 'express';

/**
 * Business logic
 */
import { AgentBusinessLogic } from '../api/agent/bl/agent-bl';

/**
 * Libs
 */
import { ManageError } from '@/libs/manage-error';

/**
 * Handlers
 */
import { apiErrorHandler } from '@/handler/error-handler';

export class ExistAutorizationAgentPolicy {
  static async init(req: Request, res: Response, next: NextFunction) {
    const status = 404;
    try {
      const headerId: string = 'Authorization';
      const targetKey: string = 'agent';
      const email: string = req.get(headerId);
      if (email === undefined) {
        throw new ManageError(status, 'agent-id-not-found', 'Missing params');
      }
      const agentBL = new AgentBusinessLogic();
      const agent = await agentBL.getBy({ email });
      if (agent.length === 0) {
        throw new ManageError(404, 'agent-not-found', 'Agent not found');
      }
      req[targetKey] = agent[0];
    } catch (error) {
      return apiErrorHandler(error, req, res);
    }
    next();
  }
}
