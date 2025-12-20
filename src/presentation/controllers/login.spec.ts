import { Authentication } from '../../domain/usecases/authentication';
import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '../helper/http-helper';
import { EmailValidator } from '../protocols/email-validator';
import { HttpRequest } from '../protocols/http';
import { LoginController } from './login';

function makeAuthentication() {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return 'any_token';
    }
  }
  return new AuthenticationStub();
}

function makeEmailValidator() {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
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
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
};

function makeSut(): SutTypes {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();
  const sut = new LoginController(emailValidatorStub, authenticationStub);

  return {
    sut,
    emailValidatorStub,
    authenticationStub,
  };
}

describe('Login Controller', () => {
  it('should return 400 if no email is provided', async () => {
    // Arrange
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('should return 400 if no password is provided', async () => {
    // Arrange
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
      },
    };

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  it('should call EmailValidator with correct email', async () => {
    // Arrange
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    // Act
    await sut.handle(makeFakeRequest());

    // Assert
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('should return 400 if an invalid email is provided', async () => {
    // Arrange
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    // Act
    const httpResponse = await sut.handle(makeFakeRequest());

    // Assert
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('should return 500 if EmailValidator throws', async () => {
    // Arrange
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    // Act
    const httpResponse = await sut.handle(makeFakeRequest());

    // Assert
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should call authentication with correct values', async () => {
    // Arrange
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');

    // Act
    await sut.handle(makeFakeRequest());

    // Assert
    expect(authSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password');
  });

  it('should return 401 if invalid credentials are provided', async () => {
    // Arrange
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(Promise.resolve(null));

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
});
