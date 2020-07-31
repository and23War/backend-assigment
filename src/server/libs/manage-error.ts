export class ManageError extends Error{
  status: number;
  slug: string;
  loggerLevel: string;

  constructor(status?: number, slug?: string, message: string = 'Internal Server Error') {
    super(message);
    this.init(status, slug);

  }

  private init(status: number, slug: string) {
    this.status = status ? status : 500;
    this.slug = slug ? slug : 'internal-server-error';
    this.checkLogger();
  }

  private checkLogger() {
    switch (this.status) {
      case 500:
        this.loggerLevel = 'error';
        break;
      default:
        this.loggerLevel = 'info';
        break;
    }
  }

}
