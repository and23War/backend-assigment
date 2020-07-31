import { Request, Response, NextFunction } from 'express';

/**
 * Business logic
 */
import { IssueBusinessLogic } from '../api/issue/bl/issue-bl';

/**
 * Libs
 */
import { ManageError } from '@/libs/manage-error';

/**
 * Handlers
 */
import { apiErrorHandler } from '@/handler/error-handler';

export class ExistIssuePolicy {
  static async init(req: Request, res: Response, next: NextFunction) {
    const status = 404;
    try {
      const paramId: string = 'issueId';
      const targetKey: string = 'targetIssue';
      if (req.params[paramId] === undefined) {
        throw new ManageError(status, 'issue-id-not-found', 'Missing params');
      }
      const issueBL = new IssueBusinessLogic();
      const issueId = +req.params[paramId];
      const issue = await issueBL.getById(issueId);
      if (!issue) {
        throw new ManageError(404, 'issue-not-found', 'Issue not found');
      }
      req[targetKey] = issue;
    } catch (error) {
      return apiErrorHandler(error, req, res);
    }
    next();
  }
}
