import { Authentication } from '@/domain';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation';
import { Validation } from '@/validation';

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { email, password } = httpRequest.body;

      const accessToken = await this.authentication.auth({
        email,
        password,
      });

      if (!accessToken) {
        return unauthorized();
      }

      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
