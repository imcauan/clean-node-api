import { EmailValidatorAdapter } from './email-validator';
import validator from 'validator';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

describe('EmailValidator Adapter', () => {
  it('should return false if validator returns false', () => {
    // Arrange
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    // Act
    const isValid = sut.isValid('invalid_email@mail.com');

    // Assert
    expect(isValid).toBe(false);
  });

  it('should return true if validator returns true', () => {
    // Arrange
    const sut = new EmailValidatorAdapter();

    // Act
    const isValid = sut.isValid('valid_email@mail.com');

    // Assert
    expect(isValid).toBe(true);
  });
});
