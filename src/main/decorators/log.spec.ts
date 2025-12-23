import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { AccountModel } from '../../domain/models/account';
import { serverError } from '../../presentation/helpers/http/http-helper';
import { Controller } from '../../presentation/protocols/controller';
import { HttpRequest, HttpResponse } from '../../presentation/protocols/http';
import { LogControllerDecorator } from './log';
import { ok } from '../../presentation/helpers/http/http-helper';

function makeFakeServerError(): HttpResponse {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
}

function makeFakeAccount(): AccountModel {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
  };
}

function makeFakeRequest(): HttpRequest {
  return {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password',
    },
  };
}

function makeLogErrorRepository(): LogErrorRepository {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }

  return new LogErrorRepositoryStub();
}

function makeController(): Controller {
  class ControllerStub implements Controller {
    async handle(_httpRequest: any): Promise<HttpResponse> {
      return new Promise(resolve => resolve(ok(makeFakeAccount())));
    }
  }

  return new ControllerStub();
}

type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
};

function makeSut(): SutTypes {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(
    controllerStub,
    logErrorRepositoryStub,
  );

  return { sut, controllerStub, logErrorRepositoryStub };
}

describe('LogController Decorator', () => {
  it('should call controller handle with correct values', async () => {
    // Arrange
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');

    // Act
    await sut.handle(makeFakeRequest());

    // Assert
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  it('should return the same result as the controller', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const result = await sut.handle(makeFakeRequest());

    // Assert
    expect(result).toEqual(ok(makeFakeAccount()));
  });

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    // Arrange
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(
        new Promise(resolve => resolve(makeFakeServerError())),
      );

    // Act
    await sut.handle(makeFakeRequest());

    // Assert
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
