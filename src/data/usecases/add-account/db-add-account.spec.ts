import { AccountModel } from '../../../domain/models/account';
import { AddAccountModel } from '../../../domain/usecases/add-account';
import { AddAccountRepository } from '../../protocols/database/account/add-account-repository';
import { Hasher } from '../../protocols/crypto/hasher';
import { DbAddAccount } from './db-add-account';

function makeHasher(): Hasher {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'));
    }
  }

  return new HasherStub();
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
  HasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
};

function makeSut(): SutTypes {
  const HasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(HasherStub, addAccountRepositoryStub);

  return {
    sut,
    HasherStub,
    addAccountRepositoryStub,
  };
}

describe('DbAddAccount UseCase', () => {
  it('should call Hasher with correct password', () => {
    // Arrange
    const { sut, HasherStub } = makeSut();
    const hashSpy = jest.spyOn(HasherStub, 'hash');

    // Act
    sut.add(makeFakeAccountData());

    // Assert
    expect(hashSpy).toHaveBeenCalledWith('valid_password');
  });

  it('should throw if Hasher throws', async () => {
    // Arrange
    const { sut, HasherStub } = makeSut();
    jest
      .spyOn(HasherStub, 'hash')
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
