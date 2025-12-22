import { MissingParamError } from '../../errors/missing-param-error';
import { Validation } from './validation';
import { ValidationComposite } from './validation-composite';

function makeValidation(): Validation {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
}

type SutTypes = {
  sut: ValidationComposite;
  validationStub: Validation;
};

function makeSut(): SutTypes {
  const validationStub = makeValidation();
  const sut = new ValidationComposite([validationStub]);

  return { sut, validationStub };
}

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    // Arrange
    const { sut, validationStub } = makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));

    // Act
    const error = sut.validate({ field: 'any_value' });

    // Assert
    expect(error).toEqual(new MissingParamError('field'));
  });
});
