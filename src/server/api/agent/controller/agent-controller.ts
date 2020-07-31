import { Request, Response } from 'express';
import { validate, Validate } from 'class-validator';
import * as _ from 'lodash';

/**
 * Libs
 */
import { ManageError } from '@/libs/manage-error';

/**
 * Utils
 */
import { Validation } from '@/utils';

/**
 * Business logics
 */
import { AgentBusinessLogic } from '../bl/agent-bl';
import { IssueBusinessLogic } from '../../issue/bl/issue-bl';

/**
 * Handlers
 */
import { apiErrorHandler } from '@/handler/error-handler';

/**
 * Entities
 */
import { Agent } from '../entity/agent-entity';

export class AgentController {
  agent: AgentBusinessLogic;
  issue: IssueBusinessLogic;

  constructor() {
    this.agent = new AgentBusinessLogic();
    this.issue = new IssueBusinessLogic();
  }

  async create(req: Request, res: Response) {
    try {
      const { name, email } = req.body;
      const agent = new Agent();
      agent.name = name;
      agent.email = email;

      if (!Validation.isEmail(agent.email)) throw new ManageError(400, 'email-invalid', 'El email ingresado no es valido');

      const emailExist = await this.agent.getBy({ email: agent.email });
      if (emailExist.length > 0 && agent.email === emailExist[0].email) {
        throw new ManageError(400, 'agent-email-exist', 'El email se encuentra registrado');
      }

      const errors = await validate(agent);
      if (errors.length > 0) {
        throw new ManageError(400, ''.concat(errors[0].property, '-', Object.keys(errors[0].constraints)[0]), '');
      }

      const newAgent = await this.agent.create(agent);

      // Search for an issue on status Open in the system to assign it to the agent
      await this.issue.assignAgent(undefined, newAgent);

      res.status(201).json({
        data: { agent: newAgent },
      });
    } catch (error) {
      apiErrorHandler(error, req, res);
    }
  }
}
