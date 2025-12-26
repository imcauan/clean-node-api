import { AccountModel } from '../../../domain/models/account';
import { AddAccountModel } from '../../../domain/usecases/add-account';
import { AddAccountRepository } from '../../protocols/database/add-account-repository';
import { Encrypter } from '../../protocols/crypto/encrypter';
import { DbAddAccount } from './db-add-account';

function makeEncrypter(): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'));
    }
  }

  return new EncrypterStub();
}

function makeFakeAccountData(): AddAccountModel {
  return {
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
  };
}

function makeFakeAccount(): AccountModel {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
  };
}

function makeAddAccountRepository(): AddAccountRepository {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()));
    }
  }

  return new AddAccountRepositoryStub();
}

type SutTypes = {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
};

function makeSut(): SutTypes {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
  };
}

describe('DbAddAccount UseCase', () => {
  it('should call Encrypter with correct password', () => {
    // Arrange
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    // Act
    sut.add(makeFakeAccountData());

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

    // Act
    const promise = sut.add(makeFakeAccountData());

    // Assert
    await expect(promise).rejects.toThrow();
  });

  it('should call AddAccountRepository with correct values', async () => {
    // Arrange
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    // Act
    await sut.add(makeFakeAccountData());

    // Assert
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password',
    });
  });

  it('should throw if AddAccountRepository throws', async () => {
    // Arrange
    const { sut, addAccountRepositoryStub } = makeSut();
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((_resolve, reject) => reject(new Error())),
      );

    // Act
    const promise = sut.add(makeFakeAccountData());

    // Assert
    await expect(promise).rejects.toThrow();
  });

  it('should return an account if AddAccountRepository succeeds', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const account = await sut.add(makeFakeAccountData());

    // Assert
    expect(account).toEqual(makeFakeAccount());
  });
});
