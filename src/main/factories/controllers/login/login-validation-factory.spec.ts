import { EmailValidation } from '../../../../validation/validators/email-validation';
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation';
import { ValidationComposite } from '../../../../validation/validators/validation-composite';

import { EmailValidator } from '../../../../validation/protocols/email-validator';
import { Validation } from '../../../../validation/protocols/validation';
import { makeLoginValidation } from './login-validation-factory';

jest.mock('../../../../validation/validators/validation-composite');

function makeEmailValidator(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

describe('Login Validation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    // Arrange & Act
    makeLoginValidation();
    const validations: Validation[] = [];

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new EmailValidation('email', makeEmailValidator()));

    // Assert
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
