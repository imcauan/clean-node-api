import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
  EmailValidator,
  Validation,
} from '@/validation';
import { makeLoginValidation } from '@/main';

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
