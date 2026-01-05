import { AccountModel, LoadAccountByToken } from '@/domain';
import {
  AccessDeniedError,
  forbidden,
  AuthMiddleware,
  HttpRequest,
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

function makeSut(): SutTypes {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub);

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
    const { sut, loadAccountByTokenStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');

    // Act
    await sut.handle(makeFakeRequest());

    // Assert
    expect(loadSpy).toHaveBeenCalledWith('any_token');
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
});
