import { AccountModel, LoadAccountByToken } from '@/domain';
import { AccessDeniedError, forbidden, AuthMiddleware } from '@/presentation';

function makeFakeAccountData(): AccountModel {
  return {
    id: 'any_id',
    email: 'any_email@mail.com',
    name: 'any_name',
    password: 'hashed_password',
  };
}

function makeLoadAccountByToken() {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return makeFakeAccountData();
    }
  }

  return new LoadAccountByTokenStub();
}

describe('Auth Middleware', () => {
  it('should return 403 if authorization does not exist in headers', async () => {
    // Arrange
    const loadAccountByTokenStub = makeLoadAccountByToken();
    const sut = new AuthMiddleware(loadAccountByTokenStub);

    // Act
    const result = await sut.handle({});

    // Assert
    expect(result).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should call LoadAccountByToken with correct accessToken', async () => {
    // Arrange
    const loadAccountByTokenStub = makeLoadAccountByToken();
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
    const sut = new AuthMiddleware(loadAccountByTokenStub);

    // Act
    await sut.handle({
      headers: {
        authorization: 'any_token',
      },
    });

    // Assert
    expect(loadSpy).toHaveBeenCalledWith('any_token');
  });
});
