import { MissingParamError } from '../../presentation/errors/missing-param-error';
import { Validation } from '../../validation/protocols/validation';
import { ValidationComposite } from './validation-composite';

function makeValidation(): Validation {
  class ValidationStub implements Validation {
    validate(input: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
}

type SutTypes = {
  sut: ValidationComposite;
  validationStubs: Validation[];
};

function makeSut(): SutTypes {
  const validationStubs = [makeValidation(), makeValidation()];
  const sut = new ValidationComposite(validationStubs);

  return { sut, validationStubs };
}

describe('Validation Composite', () => {
  it('should return an error if any validation fails', () => {
    // Arrange
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));

    // Act
    const error = sut.validate({ field: 'any_value' });

    // Assert
    expect(error).toEqual(new MissingParamError('field'));
  });

  it('should return the first error if more than one validation fails', () => {
    // Arrange
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));

    // Act
    const error = sut.validate({ field: 'any_value' });

    // Assert
    expect(error).toEqual(new Error());
  });

  it('should not return if validation succeeds', () => {
    // Arrange
    const { sut } = makeSut();

    // Act
    const error = sut.validate({ field: 'any_value' });

    // Assert
    expect(error).toBeFalsy();
  });
});
