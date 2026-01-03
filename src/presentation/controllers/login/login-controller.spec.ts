import {
  Authentication,
  AuthenticationModel,
} from '../../../domain/usecases/authentication';
import { MissingParamError } from '../../errors/missing-param-error';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '../../helpers/http/http-helper';
import { Validation } from '../../protocols/validation';
import { HttpRequest } from '../../protocols/http';
import { LoginController } from './login-controller';

function makeValidation(): Validation {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }

  return new ValidationStub();
}

function makeAuthentication() {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationModel): Promise<string> {
      return 'any_token';
    }
  }
  return new AuthenticationStub();
}

function makeFakeRequest(): HttpRequest {
  return {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password',
    },
  };
}

type SutTypes = {
  sut: LoginController;
  authenticationStub: Authentication;
  validationStub: Validation;
};

function makeSut(): SutTypes {
  const authenticationStub = makeAuthentication();
  const validationStub = makeValidation();
  const sut = new LoginController(authenticationStub, validationStub);

  return {
    sut,
    authenticationStub,
    validationStub,
  };
}

describe('Login Controller', () => {
  it('should call authentication with correct values', async () => {
    // Arrange
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');

    // Act
    await sut.handle(makeFakeRequest());

    // Assert
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });

  it('should return 401 if invalid credentials are provided', async () => {
    // Arrange
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(Promise.resolve(''));

    // Act
    const httpResponse = await sut.handle(makeFakeRequest());

    // Assert
    expect(httpResponse).toEqual(unauthorized());
  });

  it('should return 500 if Authentication throws', async () => {
    // Arrange
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error());

    // Act
    const httpResponse = await sut.handle(makeFakeRequest());

    // Assert
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 200 if valid credentials are provided', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const httpResponse = await sut.handle(makeFakeRequest());

    // Assert
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });

  it('should call Validation with correct value', async () => {
    // Arrange
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeFakeRequest();

    // Act
    await sut.handle(httpRequest);

    // Assert
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 400 if Validation returns an error', async () => {
    // Arrange
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));
    const httpRequest = makeFakeRequest();

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field')),
    );
  });
});
