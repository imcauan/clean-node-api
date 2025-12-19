import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helper/http-helper';
import { Controller } from '../protocols/controller';
import { EmailValidator } from '../protocols/email-validator';
import { HttpRequest, HttpResponse } from '../protocols/http';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body?.email) {
      return badRequest(new MissingParamError('email'));
    }

    if (!httpRequest.body?.password) {
      return badRequest(new MissingParamError('password'));
    }

    const isValid = this.emailValidator.isValid(httpRequest.body.email);

    if (!isValid) {
      return badRequest(new InvalidParamError('email'));
    }
  }
}
