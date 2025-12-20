import { SignUpController } from './signup';
import { MissingParamError } from '../../errors/missing-param-error';
import { InvalidParamError } from '../../errors/invalid-param-error';
import { EmailValidator } from '../../protocols/email-validator';
import { ServerError } from '../../errors/server-error';
import { AccountModel } from '../../../domain/models/account';
import {
  AddAccount,
  AddAccountModel,
} from '../../../domain/usecases/add-account';
import { HttpRequest } from '../../protocols/http';
import { ok, badRequest, serverError } from '../../helper/http-helper';

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

function makeFakeAccount(): AccountModel {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
  };
}

function makeAddAccount(): AddAccount {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()));
    }
  }

  return new AddAccountStub();
}

function makeEmailValidator(): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}

type SutTypes = {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
};

function makeSut(): SutTypes {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();

  const sut = new SignUpController(emailValidatorStub, addAccountStub);

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
  };
}

describe('SignUp Controller', () => {
  it('should return 400 if no name is provided', async () => {
    // Arrange
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
  });

  it('should return 400 if no email is provided', async () => {
    // Arrange
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
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
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password',
      },
    };

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  it('should return 400 if no passwordConfirmation is provided', async () => {
    // Arrange
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('passwordConfirmation')),
    );
  });

  it('should return 400 if passwordConfirmation fails', async () => {
    // Arrange
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
      },
    };

    // Act
    const httpResponse = await sut.handle(httpRequest);

    // Assert
    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('passwordConfirmation')),
    );
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

  it('should call EmailValidator with correct email', async () => {
    // Arrange
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    // Act
    await sut.handle(makeFakeRequest());

    // Assert
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
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
    expect(httpResponse).toEqual(serverError(new ServerError('any_error')));
  });

  it('should call AddAccount with correct values', async () => {
    // Arrange
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');

    // Act
    await sut.handle(makeFakeRequest());

    // Assert
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });

  it('should return 500 if AddAccount throws', async () => {
    // Arrange
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((_resolve, reject) => reject(new Error()));
    });

    // Act
    const httpResponse = await sut.handle(makeFakeRequest());

    // Assert
    expect(httpResponse).toEqual(serverError(new ServerError('any_error')));
  });

  it('should return 200 if valid data is provided', async () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const httpResponse = await sut.handle(makeFakeRequest());

    // Assert
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });
});
