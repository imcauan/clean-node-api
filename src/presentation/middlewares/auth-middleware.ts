import {
  AccessDeniedError,
  forbidden,
  HttpRequest,
  HttpResponse,
  Middleware,
} from '@/presentation';

export class AuthMiddleware implements Middleware {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return forbidden(new AccessDeniedError());
  }
}
