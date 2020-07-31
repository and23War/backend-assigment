import { Request, Response } from 'express';
import { validate } from 'class-validator';
import * as _ from 'lodash';

/**
 * Libs
 */
import { ManageError } from '@/libs/manage-error';

/**
 * Business logics
 */
import { IssueBusinessLogic } from '../bl/issue-bl';

/**
 * Handlers
 */
import { apiErrorHandler } from '@/handler/error-handler';

/**
 * Entities
 */
import { Issue } from '../entity/issue-entity';
import { Agent } from '../../agent/entity/agent-entity';

export class IssueController {
  issue: IssueBusinessLogic;

  constructor() {
    this.issue = new IssueBusinessLogic();
  }

  async create(req: Request, res: Response) {
    try {
      const { description, nameUser, emailUser } = req.body;
      const issue = new Issue();
      issue.nameUser = nameUser;
      issue.emailUser = emailUser;
      issue.description = description;

      const errors = await validate(issue);
      if (errors.length > 0) {
        throw new ManageError(400, ''.concat(errors[0].property, '-', Object.keys(errors[0].constraints)[0]), '');
      }

      const newIssue = await this.issue.create(issue);

      res.status(201).json({
        data: { issue: newIssue },
      });
    } catch (error) {
      apiErrorHandler(error, req, res);
    }
  }

  async resolve(req: Request, res: Response) {
    try {
      const targetKey: string = 'targetIssue';
      const issue: Issue = req[targetKey];
      const agent: Agent = req['agent'];

      if (issue.agentId !== agent.id) {
        throw new ManageError(400, 'issue-agent-not-equal', 'El agente seleccionado a el problema no es el mismo que lo intenta resolver.');
      }

      const updateIssue = await this.issue.resolve(issue);

      res.status(200).json({
        data: { issue: updateIssue },
      });
    } catch (error) {
      apiErrorHandler(error, req, res);
    }
  }
}
