import { DbAddAccount } from './db-add-account';

describe('DbAddAccount UseCase', () => {
  it('should call Encrypter with correct password', () => {
    // Arrange
    class EncrypterStub {
      async encrypt(value: string): Promise<string> {
        return new Promise(resolve => resolve('hashed_password'));
      }
    }

    const encrypterStub = new EncrypterStub();
    const sut = new DbAddAccount(encrypterStub);
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };

    // Act
    sut.add(accountData);

    // Assert
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });
});
