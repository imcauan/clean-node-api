import { EmailValidatorAdapter } from './email-validator';

describe('EmailValidator Adapter', () => {
  it('should return false if validator returns false', () => {
    // Arrange
    const sut = new EmailValidatorAdapter();

    // Act
    const isValid = sut.isValid('invalid_email.com');

    // Assert
    expect(isValid).toBe(false);
  });
});
