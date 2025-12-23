import { SignUpController } from './signup';
import { MissingParamError } from '../../errors/missing-param-error';
import { ServerError } from '../../errors/server-error';
import { AccountModel } from '../../../domain/models/account';
import {
  AddAccount,
  AddAccountModel,
} from '../../../domain/usecases/add-account';
import { HttpRequest } from '../../protocols/http';
import { ok, badRequest, serverError } from '../../helpers/http/http-helper';
import { Validation } from '../../protocols/validation';

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

function makeValidation(): Validation {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
}

function makeAddAccount(): AddAccount {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()));
    }
  }

  return new AddAccountStub();
}

type SutTypes = {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
};

function makeSut(): SutTypes {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();

  const sut = new SignUpController(addAccountStub, validationStub);

  return {
    sut,
    addAccountStub,
    validationStub,
  };
}

describe('SignUp Controller', () => {
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
