import { CompareFieldsValidation } from '../../../../validation/validators/compare-fields-validation';
import { EmailValidation } from '../../../../validation/validators/email-validation';
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation';
import { Validation } from '../../../../validation/protocols/validation';
import { ValidationComposite } from '../../../../validation/validators/validation-composite';
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter';

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
