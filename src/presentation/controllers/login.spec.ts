import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helper/http-helper';
import { LoginController } from './login';

type SutTypes = {
  sut: LoginController;
};

function makeSut(): SutTypes {
  const sut = new LoginController();

  return {
    sut,
  };
}

describe('Login Controller', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });
});
