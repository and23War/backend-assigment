import { Router } from 'express';

export class Private {
  static init(): Router {
    const router = Router();
    this.initPolicies(router);
    return router;
  }

  /**
   * Initialize policy list
   * @param router: Express.Router object
   */
  static initPolicies(router: Router): void {}
}
