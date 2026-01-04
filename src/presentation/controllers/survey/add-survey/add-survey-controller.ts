import { Controller, HttpRequest, HttpResponse } from '@/presentation';
import { Validation } from '@/validation';

export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body);

    return Promise.resolve(null);
  }
}
