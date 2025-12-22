import { EmailValidation } from './email-validation';
import { EmailValidator } from '../../protocols/email-validator';
import { InvalidParamError } from '../../errors/invalid-param-error';

function makeEmailValidator(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

type SutTypes = {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
};

function makeSut(): SutTypes {
  const emailValidatorStub = makeEmailValidator();

  const sut = new EmailValidation('email', emailValidatorStub);

  return {
    sut,
    emailValidatorStub,
  };
}

describe('EmailValidation', () => {
  it('should return an error if EmailValidator returns false', async () => {
    // Arrange
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    // Act
    const error = sut.validate({ email: 'invalid_mail@mail.com' });

    // Assert
    expect(error).toEqual(new InvalidParamError('email'));
  });

  it('should call EmailValidator with correct email', async () => {
    // Arrange
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    // Act
    sut.validate({ email: 'any_email@mail.com' });

    // Assert
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('should throw if EmailValidator throws', async () => {
    // Arrange
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    // Act & Assert
    expect(sut.validate).toThrow();
  });
});
