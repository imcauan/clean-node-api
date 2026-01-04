import {
  EmailValidation,
  RequiredFieldValidation,
  Validation,
  ValidationComposite,
} from '@/validation';
import { EmailValidatorAdapter } from '@/infra';

export function makeLoginValidation(): ValidationComposite {
  const validations: Validation[] = [];

  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field));
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
}
