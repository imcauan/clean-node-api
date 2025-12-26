import { AccountModel } from '../../../domain/models/account';
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';
import { DbAuthentication } from './db-authentication';

describe('DBAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    // Arrange
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load(email: string): Promise<AccountModel> {
        return {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@email.com',
          password: 'any_password',
        };
      }
    }
    const loadAccountByEmailRepositoryStub =
      new LoadAccountByEmailRepositoryStub();
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    // Act
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password',
    });

    // Assert
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
