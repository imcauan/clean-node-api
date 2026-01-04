import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
  EmailValidator,
  Validation,
} from '@/validation';
import { makeSignUpValidation } from '@/main';

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
