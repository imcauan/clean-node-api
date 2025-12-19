import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helper/http-helper';
import { EmailValidator } from '../protocols/email-validator';
import { LoginController } from './login';

function makeEmailValidator() {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
}

type SutTypes = {
  sut: LoginController;
  emailValidatorStub: EmailValidator;
};

function makeSut(): SutTypes {
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(emailValidatorStub);

  return {
    sut,
    emailValidatorStub,
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

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const httpRequest = {
      body: {
        email: 'valid_email@email.com',
        password: 'any_password',
      },
    };

    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith('valid_email@email.com');
  });
});
