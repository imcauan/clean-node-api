import { AddSurveyController, Controller } from '@/presentation';
import {
  makeLogControllerDecorator,
  makeAddSurveyValidation,
  makeDbAddSurvey,
} from '@/main/factories';

export function makeAddSurveyController(): Controller {
  const controller = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey(),
  );

  return makeLogControllerDecorator(controller);
}
