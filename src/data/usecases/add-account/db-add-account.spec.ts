import { Encrypter } from '../../protocols/encrypter';
import { DbAddAccount } from './db-add-account';

function makeEncrypterStub(): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'));
    }
  }

  return new EncrypterStub();
}

type SutTypes = {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
};

function makeSut(): SutTypes {
  const encrypterStub = makeEncrypterStub();
  const sut = new DbAddAccount(encrypterStub);

  return {
    sut,
    encrypterStub,
  };
}

describe('DbAddAccount UseCase', () => {
  it('should call Encrypter with correct password', () => {
    // Arrange
    const { sut, encrypterStub } = makeSut();
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
