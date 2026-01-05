import { LoadAccountByToken } from '@/domain';
import {
  AccessDeniedError,
  forbidden,
  HttpRequest,
  HttpResponse,
  Middleware,
} from '@/presentation';

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: LoadAccountByToken) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['authorization'];

    if (!accessToken) {
      return forbidden(new AccessDeniedError());
    }

    await this.loadAccountByToken.load(accessToken);
  }
}
