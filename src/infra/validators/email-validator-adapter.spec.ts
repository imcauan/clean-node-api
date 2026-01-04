import { EmailValidatorAdapter } from '@/infra/validators';
import validator from 'validator';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

type SutTypes = {
  sut: EmailValidatorAdapter;
};

function makeSut(): SutTypes {
  return {
    sut: new EmailValidatorAdapter(),
  };
}

describe('EmailValidator Adapter', () => {
  it('should return false if validator returns false', () => {
    // Arrange
    const { sut } = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    // Act
    const isValid = sut.isValid('invalid_email@mail.com');

    // Assert
    expect(isValid).toBe(false);
  });

  it('should return true if validator returns true', () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const isValid = sut.isValid('valid_email@mail.com');

    // Assert
    expect(isValid).toBe(true);
  });

  it('should call validator with correct email', () => {
    // Arrange
    const { sut } = makeSut();
    const isEmailSpy = jest.spyOn(validator, 'isEmail');

    // Act
    sut.isValid('any_email@mail.com');

    // Assert
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
