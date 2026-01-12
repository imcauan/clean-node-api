import {
  RequiredFieldValidation,
  Validation,
  ValidationComposite,
} from '@/validation';

export function makeAddSurveyValidation(): ValidationComposite {
  const validations: Validation[] = [];

  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field));
  }

  return new ValidationComposite(validations);
}
