import * as express from 'express';
import { IssueController } from '../controller/issue-controller';

/**
 * Policies
 */
import { ExistIssuePolicy } from '@/policy/exist-issue-policy';
import { ExistAutorizationAgentPolicy } from '@/server/policy/exist-header-agent-policy';

export class IssueRoutes {
  static init(router: express.Router) {
    this.initPolicies(router);

    const issueController = new IssueController();

    router.route('/issue').post((req, res) => issueController.create(req, res));

    router.route('/issue/:issueId([0-9]+)/resolve').put((req, res) => issueController.resolve(req, res));
  }

  /**
   * Initialize policy list
   * @param router: Express.Router object
   */
  static initPolicies(router: express.Router): void {
    router.use('/issue/:issueId([0-9]+)', ExistIssuePolicy.init);
    router.use('/issue/:issueId([0-9]+)/resolve', ExistAutorizationAgentPolicy.init);
  }
}
