import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { serverError } from '../../presentation/helper/http-helper';
import { Controller } from '../../presentation/protocols/controller';
import { HttpResponse } from '../../presentation/protocols/http';
import { LogControllerDecorator } from './log';

function makeLogErrorRepository(): LogErrorRepository {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }

  return new LogErrorRepositoryStub();
}

function makeController(): Controller {
  class ControllerStub implements Controller {
    async handle(httpRequest: any): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'valid_name',
        },
      };

      return new Promise(resolve => resolve(httpResponse));
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
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    await sut.handle(httpRequest);

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  it('should return the same result as the controller', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    const result = await sut.handle(httpRequest);

    expect(result).toEqual({
      statusCode: 200,
      body: {
        name: 'valid_name',
      },
    });
  });

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const fakeError = new Error();
    fakeError.stack = 'any_stack';
    const error = serverError(fakeError);
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise(resolve => resolve(error)));

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    await sut.handle(httpRequest);

    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
