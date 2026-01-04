import { AddSurvey } from '@/domain';
import {
  badRequest,
  Controller,
  HttpRequest,
  HttpResponse,
  serverError,
} from '@/presentation';
import { Validation } from '@/validation';

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { question, answers } = httpRequest.body;

      await this.addSurvey.add({
        question,
        answers,
      });

      return Promise.resolve(null);
    } catch (error) {
      return serverError(error);
    }
  }
}
