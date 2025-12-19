import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helper/http-helper';
import { Controller } from '../protocols/controller';
import { HttpRequest, HttpResponse } from '../protocols/http';

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body?.email) {
      return badRequest(new MissingParamError('email'));
    }

    if (!httpRequest.body?.password) {
      return badRequest(new MissingParamError('password'));
    }
  }
}
