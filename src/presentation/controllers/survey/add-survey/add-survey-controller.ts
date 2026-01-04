import {
  badRequest,
  Controller,
  HttpRequest,
  HttpResponse,
} from '@/presentation';
import { Validation } from '@/validation';

export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body);

    if (error) {
      return badRequest(error);
    }

    return Promise.resolve(null);
  }
}
