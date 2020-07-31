import { Application } from 'express';

import { Private } from './private';
import { Public } from './public';

/**
 * Policies
 */

export class Routes {
  static init(app: Application) {
    this.initGlobalPolicies(app);
    this.initPublicRoutes(app);
    this.initPrivateRoute(app);
  }

  /**
   * Initialize global policy list
   */
  static initGlobalPolicies(app: Application): void {}

  /**
   * Initialize public routes
   * @param app: Express.Application object
   */
  static initPublicRoutes(app: Application): void {
    // Define public endpoint prefix
    app.use('/api/', Public.init());
  }

  /**
   * Initialize private routes
   * @param app: Express.Application object
   */
  static initPrivateRoute(app: Application): void {
    // Define private endpoint prefix
    app.use('/api/private/', Private.init());
  }

}
