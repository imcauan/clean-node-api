import { AccountModel } from '../../../domain/models/account';
import { AuthenticationModel } from '../../../domain/usecases/authentication';
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';
import { DbAuthentication } from './db-authentication';

function makeFakeAccount(): AccountModel {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
  };
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
};

function makeSut(): SutTypes {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

  return {
    sut,
    loadAccountByEmailRepositoryStub,
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
});
