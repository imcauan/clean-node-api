import { LoadAccountByToken } from '@/domain';
import {
  AccessDeniedError,
  forbidden,
  HttpRequest,
  HttpResponse,
  Middleware,
  ok,
  serverError,
} from '@/presentation';

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['authorization'];

      if (!accessToken) {
        return forbidden(new AccessDeniedError());
      }

      const account = await this.loadAccountByToken.load(accessToken);

      return ok({
        accountId: account.id,
      });
    } catch (error) {
      return serverError(error);
    }
  }
}
