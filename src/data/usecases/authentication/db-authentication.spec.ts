import { AccountModel } from '../../../domain/models/account';
import { AuthenticationModel } from '../../../domain/usecases/authentication';
import { HashComparer } from '../../protocols/crypto/hash-comparer';
import { LoadAccountByEmailRepository } from '../../protocols/database/load-account-by-email-repository';
import { DbAuthentication } from './db-authentication';

function makeFakeAccount(): AccountModel {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'hashed_password',
  };
}

function makeHashComparer(): HashComparer {
  class HashComparerStub implements HashComparer {
    async compare(password: string, passwordHash: string): Promise<boolean> {
      return true;
    }
  }

  return new HashComparerStub();
}

function makeLoadAccountByEmailRepository(): LoadAccountByEmailRepository {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }

  return new LoadAccountByEmailRepositoryStub();
}

function makeFakeAuthentication(): AuthenticationModel {
  return {
    email: 'any_email@mail.com',
    password: 'any_password',
  };
}

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
};

function makeSut(): SutTypes {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
  };
}

describe('DBAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    // Arrange
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    // Act
    await sut.auth(makeFakeAuthentication());

    // Assert
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    // Arrange
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockImplementationOnce(() => Promise.reject(new Error()));

    // Act
    const promise = sut.auth(makeFakeAuthentication());

    // Assert
    expect(promise).rejects.toThrow();
  });

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    // Arrange
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(null);

    // Act
    const result = await sut.auth(makeFakeAuthentication());

    // Assert
    expect(result).toBeNull();
  });

  it('should call HashComparer with correct values', async () => {
    // Arrange
    const { sut, hashComparerStub } = makeSut();
    const hashSpy = jest.spyOn(hashComparerStub, 'compare');

    // Act
    await sut.auth(makeFakeAuthentication());

    // Assert
    expect(hashSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
  });

  it('should throw if HashComparer throws', async () => {
    // Arrange
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockImplementationOnce(() => Promise.reject(new Error()));

    // Act
    const promise = sut.auth(makeFakeAuthentication());

    // Assert
    expect(promise).rejects.toThrow();
  });

  it('should return null if HashComparer returns false', async () => {
    // Arrange
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(false));

    // Act
    const result = await sut.auth(makeFakeAuthentication());

    // Assert
    expect(result).toBeNull();
  });
});
