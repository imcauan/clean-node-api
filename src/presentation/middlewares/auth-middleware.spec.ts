import { AccountModel, LoadAccountByToken } from '@/domain';
import {
  AccessDeniedError,
  forbidden,
  AuthMiddleware,
  HttpRequest,
  ok,
  serverError,
} from '@/presentation';

function makeFakeRequest(): HttpRequest {
  return {
    headers: {
      authorization: 'any_token',
    },
  };
}

function makeFakeAccountData(): AccountModel {
  return {
    id: 'any_id',
    email: 'any_email@mail.com',
    name: 'any_name',
    password: 'hashed_password',
  };
}

function makeLoadAccountByToken(): LoadAccountByToken {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return makeFakeAccountData();
    }
  }

  return new LoadAccountByTokenStub();
}

type SutTypes = {
  loadAccountByTokenStub: LoadAccountByToken;
  sut: AuthMiddleware;
};

function makeSut(role?: string): SutTypes {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub, role);

  return {
    loadAccountByTokenStub,
    sut,
  };
}

describe('Auth Middleware', () => {
  it('should return 403 if authorization does not exist in headers', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const result = await sut.handle({});

    // Assert
    expect(result).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should call LoadAccountByToken with correct accessToken', async () => {
    // Arrange
    const role = 'any_role';
    const { sut, loadAccountByTokenStub } = makeSut(role);
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');

    // Act
    await sut.handle(makeFakeRequest());

    // Assert
    expect(loadSpy).toHaveBeenCalledWith('any_token', role);
  });

  it('should return 403 if LoadAccountByToken returns null', async () => {
    // Arrange
    const { sut, loadAccountByTokenStub } = makeSut();
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(null);

    // Act
    const result = await sut.handle({});

    // Assert
    expect(result).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should return 200 if LoadAccountByToken returns an account', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const result = await sut.handle(makeFakeRequest());

    // Assert
    expect(result).toEqual(ok({ accountId: 'any_id' }));
  });

  it('should return 500 if LoadAccountByToken throws', async () => {
    // Arrange
    const { sut, loadAccountByTokenStub } = makeSut();
    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValue(Promise.reject(new Error()));

    // Act
    const result = await sut.handle(makeFakeRequest());

    // Assert
    expect(result).toEqual(serverError(new Error()));
  });
});
