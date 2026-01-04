import { EmailValidatorAdapter } from '@/infra';
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  Validation,
  ValidationComposite,
} from '@/validation';

export function makeSignUpValidation(): ValidationComposite {
  const validations: Validation[] = [];

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field));
  }

  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation'),
  );

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
}
