import { CompareFieldsValidation } from '../../../../validation/validators/compare-fields-validation';
import { EmailValidation } from '../../../../validation/validators/email-validation';
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation';
import { ValidationComposite } from '../../../../validation/validators/validation-composite';
import { EmailValidator } from '../../../../validation/protocols/email-validator';
import { Validation } from '../../../../validation/protocols/validation';
import { makeSignUpValidation } from './signup-validation-factory';

jest.mock('../../../../validation/validators/validation-composite');

function makeEmailValidator(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

describe('SignUp Validation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    // Arrange & Act
    makeSignUpValidation();
    const validations: Validation[] = [];

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation'),
    );

    validations.push(new EmailValidation('email', makeEmailValidator()));
    // Assert
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
