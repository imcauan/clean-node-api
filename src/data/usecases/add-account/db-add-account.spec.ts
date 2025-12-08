import { Encrypter } from '../../protocols/encrypter';
import { DbAddAccount } from './db-add-account';

function makeEncrypter(): Encrypter {
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
  const encrypterStub = makeEncrypter();
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

  it('should throw if Encrypter throws', async () => {
    // Arrange
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((_resolve, reject) => reject(new Error())),
      );

    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };

    // Act
    const promise = sut.add(accountData);

    // Assert
    await expect(promise).rejects.toThrow();
  });
});
