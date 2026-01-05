import { LoadAccountByToken } from '@/domain';
import {
  AccessDeniedError,
  forbidden,
  HttpRequest,
  HttpResponse,
  Middleware,
  ok,
} from '@/presentation';

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['authorization'];

    if (!accessToken) {
      return forbidden(new AccessDeniedError());
    }

    const account = await this.loadAccountByToken.load(accessToken);

    return ok({
      accountId: account.id,
    });
  }
}
