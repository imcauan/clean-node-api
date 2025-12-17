import { Controller } from '../../presentation/protocols/controller';
import { HttpResponse } from '../../presentation/protocols/http';
import { LogControllerDecorator } from './log';

type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: Controller;
};

function makeController(): Controller {
  class ControllerStub implements Controller {
    async handle(httpRequest: any): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'valid_name',
          email: 'valid_email@mail.com',
          password: 'valid_password',
          passwordConfirmation: 'valid_password',
        },
      };

      return new Promise(resolve => resolve(httpResponse));
    }
  }

  return new ControllerStub();
}

function makeSut(): SutTypes {
  const controllerStub = makeController();
  const sut = new LogControllerDecorator(controllerStub);

  return { sut, controllerStub };
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
});
