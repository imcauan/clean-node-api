import { AccountModel } from '@/domain/models';
import { AddAccountModel } from '@/domain/usecases';
import {
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository,
} from '@/data/protocols';
import { DbAddAccount } from '@/data/usecases';

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

function makeLoadAccountByEmailRepository(): LoadAccountByEmailRepository {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return null;
    }
  }

  return new LoadAccountByEmailRepositoryStub();
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
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
};

function makeSut(): SutTypes {
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  );

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  };
}

describe('DbAddAccount UseCase', () => {
  it('should call Hasher with correct password', async () => {
    // Arrange
    const { sut, hasherStub } = makeSut();
    const hashSpy = jest.spyOn(hasherStub, 'hash');

    // Act
    await sut.add(makeFakeAccountData());

    // Assert
    expect(hashSpy).toHaveBeenCalledWith('valid_password');
  });

  it('should throw if Hasher throws', async () => {
    // Arrange
    const { sut, hasherStub } = makeSut();
    jest
      .spyOn(hasherStub, 'hash')
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

  it('should return null if LoadAccountByEmailRepository not return null', async () => {
    // Arrange
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockResolvedValueOnce(makeFakeAccount());

    // Act
    const account = await sut.add(makeFakeAccountData());

    // Assert
    expect(account).toBeNull();
  });

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    // Arrange
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');

    // Act
    await sut.add(makeFakeAccount());

    // Assert
    expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com');
  });
});
